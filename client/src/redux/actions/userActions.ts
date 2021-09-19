function assignUserName(userName: string) {
  return { type: 'ASSIGN_USERNAME', payload: userName };
}

export default assignUserName;
