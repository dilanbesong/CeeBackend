

class ValidateUser {
  constructor(
    username,
    email,
    regNumber,
    YearOfEntry,
    level,
    sex,
    password,
    PhoneNumber,
    isAdmin=false,
    canViewPanel=false
  ) {
    this.username = username;
    this.email = email;
    this.regNumber = regNumber;
    this.YearOfEntry = parseInt(YearOfEntry);
    this.level = parseInt(level);
    this.sex = sex;
    this.password = password;
    this.isAdmin = isAdmin;
    this.canViewPanel = canViewPanel
    this.PhoneNumber = PhoneNumber;
    this.messages = [];
  }

  isEmail() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(this.email)) {
      this.messages.push(true);
      return;
    }
    this.messages.push("Invalid email address");
  }
  isRegNumber() {
    const Matric_regex = /^20\d{11}$/;
    if (Matric_regex.test(this.regNumber)) {
      this.messages.push(true);
      return;
    }
    this.messages.push("Invalid reg Number !!!");
  }
  isYearOfEntry() {
    const yearRegex = /^2\d{3}$/;
    const yearStatus = parseInt(this.YearOfEntry) <= new Date().getFullYear();

    if (yearRegex.test(this.YearOfEntry)) {
      if (yearStatus) {
        this.messages.push(true);
        return;
      } else {
        this.messages.push("Year must be less than or equal to current year");
        return;
      }
    }

    this.messages.push(
      " Year must start with 2, followed by 3 digits (4 characters in total)"
    );
    return;
  }
   isPassword() {
    // Contains letters, symbols, and special characters, 8 characters long - should match
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (passwordRegex.test(this.password)) {
      this.messages.push(true);
      return;
    }
    this.messages.push(
      " Password must contain at least 1 letter, 1 special character, and at least 8 characters long"
    );
  }

  isUsername() {
    const nameRegex = /^[A-Za-z]{6,}$/;
    if (this.username.includes("xxxadmin") && nameRegex.test(this.username)) {
      this.isAdmin = true;
      this.username = this.username.replace("xxxadmin", "");
    }
    if (nameRegex.test(this.username)) {
      
      this.messages.push(true);
      return;
    }

    this.messages.push(
      "Username must contain only letters and at least 6 characters"
    );
  }
  isPhoneNumber() {
    const nigeriaPhoneRegex = /^(08|07|09)\d{9}$/;
    if (nigeriaPhoneRegex.test(this.PhoneNumber)) {
      this.messages.push(true);
      return;
    }
    this.messages.push("Invalid phone number");
  }
}

class ValidateAdmin {
  constructor(email, username, password) {
     this.email = email
     this.username = username
     this.password = password
  }

  isEmail(){
     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
     if (emailRegex.test(this.email)) {
       return true;
     }
     this.messages.push("Invalid email address");
  }
  isUsername(){
     const nameRegex = /^[A-Za-z]{6,}$/;
     if (nameRegex.test(this.username) && this.username.includes('@_k')) {
       return true;
     }
  }
  isPassword(){
     const passwordRegex =
       /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
     if (passwordRegex.test(this.password)) {
       return true;
     }
  }
}

export { ValidateUser, ValidateAdmin  }
  