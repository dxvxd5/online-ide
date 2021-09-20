const emailRegex =
  // eslint-disable-next-line no-useless-escape
  /^(?<local>[\w!#\$%&\*\+\-\/=\?\^`\{\|\}~]+(\.+[\w!#\$%&\*\+\-\/=\?\^`\{\|\}~]+)*)@(?<domain>[0-9a-zA-Z]+(-[0-9a-zA-Z]+)*(\.[0-9a-zA-Z]+(-[0-9a-zA-Z]+)*)+)$/i;

export default emailRegex;
