import { Groq } from 'groq-sdk';
import dayjs from 'dayjs';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Time slots for each period
const TIME_SLOTS = {
  morning: { start: '06:00', end: '11:59' },
  afternoon: { start: '12:00', end: '16:59' },
  evening: { start: '17:00', end: '21:59' },
  midnight: { start: '22:00', end: '05:59' }
};

const suggestTaskSchedule = async (task, traits, pendingTodos, userPreferences) => {
  // First, analyze if the task has time-specific keywords
  const timeKeywords = {
    morning: ['morning', 'breakfast', 'dawn', 'sunrise', 'early', 'am'],
    afternoon: ['afternoon', 'lunch', 'noon'],
    evening: ['evening', 'sunset', 'dinner', 'dusk', 'pm'],
    midnight: ['night', 'midnight', 'late']
  };

  // Find natural period from task description
  const taskLower = task.toLowerCase();
  let naturalPeriod = null;
  for (const [period, keywords] of Object.entries(timeKeywords)) {
    if (keywords.some(keyword => taskLower.includes(keyword))) {
      naturalPeriod = period;
      break;
    }
  }

  // Define time ranges for each period
  const periodRanges = {
    morning: { startHour: 6, endHour: 11 },
    afternoon: { startHour: 12, endHour: 16 },
    evening: { startHour: 17, endHour: 21 },
    midnight: { startHour: 22, endHour: 5 }
  };

  // Find the next available date and time slot
  const findNextAvailableSlot = (period, duration, pendingTodos) => {
    const range = periodRanges[period];
    let currentDate = dayjs();
    let daysToCheck = 7; // Look up to a week ahead

    while (daysToCheck > 0) {
      // If task needs morning slot and current time is past morning, start with next day
      if (period === 'morning' && currentDate.hour() >= range.endHour) {
        currentDate = currentDate.add(1, 'day').hour(range.startHour).minute(0);
      }

      // Get pending todos for this date only
      const todosForDate = pendingTodos.filter(todo => 
        dayjs(todo.scheduledTime.start).isSame(currentDate, 'date') &&
        todo.status === 'pending' // Double check status
      );

      // Try each possible start time within the period
      for (let hour = range.startHour; hour <= range.endHour; hour++) {
        const proposedStart = currentDate.hour(hour).minute(0);
        const proposedEnd = proposedStart.add(duration, 'minute');

        // Skip if proposed time is in the past
        if (proposedStart.isBefore(dayjs())) {
          continue;
        }

        // Check for conflicts with pending todos only
        const hasConflict = todosForDate.some(todo => {
          const todoStart = dayjs(todo.scheduledTime.start);
          const todoEnd = dayjs(todo.scheduledTime.end);
          return (
            proposedStart.isBetween(todoStart, todoEnd, null, '[]') ||
            proposedEnd.isBetween(todoStart, todoEnd, null, '[]') ||
            todoStart.isBetween(proposedStart, proposedEnd, null, '[]')
          );
        });

        if (!hasConflict) {
          return {
            start: proposedStart.toDate(),
            end: proposedEnd.toDate()
          };
        }
      }

      currentDate = currentDate.add(1, 'day').hour(range.startHour).minute(0);
      daysToCheck--;
    }

    // If no slot found within a week, return a default slot for tomorrow
    const tomorrow = dayjs().add(1, 'day').hour(range.startHour).minute(0);
    return {
      start: tomorrow.toDate(),
      end: tomorrow.add(duration, 'minute').toDate()
    };
  };

  // Estimate duration based on task type
  const estimateDuration = (task) => {
    const taskLower = task.toLowerCase();
    if (taskLower.includes('walk') || taskLower.includes('exercise')) return 45;
    if (taskLower.includes('meeting') || taskLower.includes('call')) return 60;
    if (taskLower.includes('quick') || taskLower.includes('brief')) return 15;
    return 30; // default duration
  };

  // Main scheduling logic
  try {
    const period = naturalPeriod || 'afternoon'; // default to afternoon if no natural period found
    const estimatedDuration = estimateDuration(task);
    const timeSlot = findNextAvailableSlot(period, estimatedDuration, pendingTodos);

    if (!timeSlot) {
      throw new Error('No available time slots found in the next week');
    }

    return {
      scheduledTime: timeSlot,
      period,
      estimatedDuration,
      priority: naturalPeriod ? 1 : 2 // Time-specific tasks get higher priority
    };
  } catch (error) {
    console.error('Error in suggestTaskSchedule:', error);
    // Fallback to a default afternoon slot tomorrow
    const tomorrow = dayjs().add(1, 'day').hour(14).minute(0);
    return {
      scheduledTime: {
        start: tomorrow.toDate(),
        end: tomorrow.add(30, 'minute').toDate()
      },
      period: 'afternoon',
      estimatedDuration: 30,
      priority: 2
    };
  }
};

const calculateTimeSlot = (suggestedSchedule, pendingTodos) => {
  const { period, estimatedDuration, suggestedTimeSlot } = suggestedSchedule;
  const baseTime = dayjs().set('hour', parseInt(suggestedTimeSlot.split(':')[0]))
                         .set('minute', parseInt(suggestedTimeSlot.split(':')[1]));
  
  // Check for conflicts with pending todos
  const conflicts = pendingTodos.filter(todo => {
    const todoStart = dayjs(todo.scheduledTime.start);
    const todoEnd = dayjs(todo.scheduledTime.end);
    const proposedEnd = baseTime.add(estimatedDuration, 'minute');
    
    return (baseTime.isBetween(todoStart, todoEnd) || 
            proposedEnd.isBetween(todoStart, todoEnd));
  });

  if (conflicts.length > 0) {
    // Find next available slot
    let nextSlot = baseTime;
    while (conflicts.some(todo => {
      const todoStart = dayjs(todo.scheduledTime.start);
      const todoEnd = dayjs(todo.scheduledTime.end);
      const proposedEnd = nextSlot.add(estimatedDuration, 'minute');
      return (nextSlot.isBetween(todoStart, todoEnd) || 
              proposedEnd.isBetween(todoStart, todoEnd));
    })) {
      nextSlot = nextSlot.add(30, 'minute');
    }
    return {
      start: nextSlot.toDate(),
      end: nextSlot.add(estimatedDuration, 'minute').toDate()
    };
  }

  return {
    start: baseTime.toDate(),
    end: baseTime.add(estimatedDuration, 'minute').toDate()
  };
};

const suggestTaskPeriod = async (task, traits) => {
  const prompt = `Given these user traits: ${traits.join(', ')}, and this task: "${task}", 
  suggest the most suitable time period (morning, afternoon, evening, or midnight) for completing this task. 
  Consider the user's personality traits and the nature of the task. 
  Return only the period name, nothing else.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
  });

  return completion.choices[0].message.content.toLowerCase().trim();
};

const updateTraitsFromCompletion = async (existingTraits, taskDetails) => {
  const prompt = `Given a user with these traits: ${existingTraits.join(', ')},
  analyze this task completion:
  - Task: ${taskDetails.task}
  - Completed: ${taskDetails.isCompletedOnTime ? 'on time' : 'late'}
  - Assigned period: ${taskDetails.assignedPeriod}
  - Completed period: ${taskDetails.completedPeriod}

  Based on this information, suggest an updated list of personality traits.
  Return only the traits as a comma-separated list, nothing else.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
  });

  return completion.choices[0].message.content.split(',').map(trait => trait.trim());
};

const suggestNewPeriodForMissed = async (task, traits, reason) => {
  const prompt = `Given these user traits: ${traits.join(', ')}, 
  this missed task: "${task}", 
  and the reason for missing it: "${reason}",
  suggest a new suitable time period (morning, afternoon, evening, or midnight) for rescheduling this task.
  Also, suggest any new traits that might be relevant based on the reason given.
  Return the response in this format: "period: <period>, traits: <trait1, trait2, ...>"`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
  });

  const response = completion.choices[0].message.content;
  const [periodPart, traitsPart] = response.split(', traits: ');
  const period = periodPart.replace('period: ', '').trim();
  const newTraits = traitsPart.split(',').map(trait => trait.trim());

  return { period, traits: newTraits };
};

export {
  suggestTaskSchedule,
  calculateTimeSlot,
  suggestTaskPeriod,
  updateTraitsFromCompletion,
  suggestNewPeriodForMissed
}; 