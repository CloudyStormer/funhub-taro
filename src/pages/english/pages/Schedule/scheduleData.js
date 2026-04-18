const today = new Date();

export { today };

export const fmt = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const generateRecords = () => {
  const records = [];
  for (let i = -20; i <= 10; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const done = i < 0 ? Math.random() > 0.25 : i === 0 ? true : false;
    records.push({
      date: fmt(d),
      done,
      minutes: done ? Math.floor(Math.random() * 40 + 20) : 0,
      tasks: done ? Math.floor(Math.random() * 3 + 1) : 0,
    });
  }
  return records;
};

export const learningRecords = generateRecords();

export const getRecord = (dateStr) =>
  learningRecords.find((r) => r.date === dateStr);

export const scheduleItems = [
  { time: '09:00', title: '商务邮件写作', duration: '30分钟', tag: '写作', tagClass: 'purple', done: true },
  { time: '11:00', title: '会议主持英语', duration: '45分钟', tag: '口语', tagClass: 'green',  done: true },
  { time: '14:30', title: '客户谈判技巧', duration: '60分钟', tag: '阅读', tagClass: 'orange', done: false },
  { time: '19:00', title: '合同术语精读', duration: '20分钟', tag: '词汇', tagClass: 'purple', done: false },
];

export const weekDayLabels = ['一', '二', '三', '四', '五', '六', '日'];
