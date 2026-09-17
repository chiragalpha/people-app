export const profile = {
  name: 'Chirag Koshti',
  nickname: 'Chirag Alphatrucking',
  email: 'chirag@alphatrucking.com.au',
  employeeId: 'N7875',
  title: 'Web Developer',
  department: 'Technology',
  location: 'Melbourne',
  manager: 'Reporting manager',
}

export const leaveBalances = [
  { name: 'Casual Leave', used: 0, available: 4, tone: 'forest' },
  { name: 'Unpaid Leave', used: 4.5, available: 0, tone: 'clay' },
  { name: 'Earned Leave', used: 1, available: 8, tone: 'ink' },
]

export const holidays = [
  { name: 'New Year', date: '01 Jan 2026' },
  { name: 'Australia Day', date: '26 Jan 2026' },
  { name: 'Good Friday', date: '03 Apr 2026' },
  { name: 'Easter Monday', date: '06 Apr 2026' },
]

export const breaks = [
  { id: 'N3899', name: 'Rex Sunboost', type: 'Out', time: '07:34 AM', date: '10 Sep 2026' },
  { id: 'N7733', name: 'Barry Luxcoora', type: 'Out', time: '07:33 AM', date: '10 Sep 2026' },
  { id: 'N724', name: 'Jerry Z', type: 'Out', time: '07:33 AM', date: '10 Sep 2026' },
  { id: 'N20922', name: 'Trevor Sunboost', type: 'In', time: '07:33 AM', date: '10 Sep 2026' },
]

export const attendance = [
  { date: '10 Sep 2026', in: '09:04', out: '18:12', hours: '8h 08m', status: 'On time' },
  { date: '09 Sep 2026', in: '09:21', out: '18:05', hours: '7h 44m', status: 'Late' },
  { date: '08 Sep 2026', in: '08:58', out: '18:01', hours: '8h 03m', status: 'On time' },
  { date: '05 Sep 2026', in: '—', out: '—', hours: '—', status: 'Leave' },
]

export const team = [
  { name: 'Bhavesh Raj', title: 'Operations', status: 'In' },
  { name: 'Jerry Z', title: 'Accounts', status: 'Break' },
  { name: 'Trevor Sunboost', title: 'Delivery', status: 'In' },
]

export const emptyCopy = {
  leave: 'No leave requests in this range.',
  regularization: 'No regularization requests yet.',
  wfh: 'No work-from-home requests yet.',
  shift: 'No shift-change requests yet.',
  overtime: 'No overtime requests yet.',
  approvals: 'Nothing waiting for you right now.',
  employees: 'Try another name or employee ID.',
}
