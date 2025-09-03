interface ReminderOptions {
  title: string;
  description: string;
  startInHours: number;
}

export function generateReminderICS({ title, description, startInHours }: ReminderOptions): string {
  const now = new Date();
  const startDate = new Date(now.getTime() + (startInHours * 60 * 60 * 1000));
  
  // Format date as YYYYMMDDTHHMMSSZ
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  const startDateStr = formatDate(startDate);
  const createdDateStr = formatDate(now);
  
  // Generate a simple UID
  const uid = `tw-reminder-${Date.now()}@talentwharf.com`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Talent Wharf//Reminder//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${createdDateStr}`,
    `DTSTART:${startDateStr}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}