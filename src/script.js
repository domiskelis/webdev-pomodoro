const defaultState = {
  workTime: 25,
  breakTime: 5,
  currentTime: 1500,
  counting: false,
  work_break: "work",
  timerID: ''
}

class Pomodoro extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.formatTime = this.formatTime.bind(this);
    this.countDown = this.countDown.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.modifyVal = this.modifyVal.bind(this);
    this.hardlyWorking = this.hardlyWorking.bind(this);
  };
  
  formatTime (number,index) {
    function Stringify(x) {
        if (x<10) { return "0"+String(x) }
        else { return String(x) }
      }
    var minutes = Math.floor(number/60);
    var seconds = number - (minutes*60);
    return Stringify(minutes)+":"+Stringify(seconds);
  }
  
  hardlyWorking(str) {
    if (str === "state-message") {
      if (!this.state.counting) {
        return "Ready when you are."
      } else {
        switch(this.state.work_break) {
          case "work":
            return "Time to work!"
          case "break":
            return "You're on break."
        };
      }
    } else if (str === "timer-icon") {
      if (!this.state.counting) {
        return "fa-solid fa-couch"
      } else {
        switch(this.state.work_break) {
          case "work":
            return "fa-solid fa-business-time"
          case "break":
            return "fa-solid fa-otter"
        }
      }
    } else if (str === "timer-control") {
      switch(this.state.counting) {
        case false:
          return "fa-solid fa-play"
        case true:
          return "fa-solid fa-pause"
      }
    }
  }
  
  countDown() {
    if (!this.state.counting) {
      let timer = setInterval(() => {
        if (this.state.currentTime > 0) {
          this.setState(prevstate => ({ currentTime: prevstate.currentTime-1 }));
        } else if (this.state.work_break === "work") {
          this.setState({ currentTime: this.state.breakTime*60, work_break: "break" });
          document.getElementById("beep").play();
        } else if (this.state.work_break === "break") {
          this.setState({ currentTime: this.state.workTime*60, work_break: "work" });
          document.getElementById("beep").play();
        }
      } ,1000);
      this.setState({timerID: timer, counting: true});
    } else { 
      this.setState({ counting: false });
      clearInterval(this.state.timerID);
    }
  }
  
  resetTimer() {
    if (this.state.counting) {
      clearInterval(this.state.timerID);
    }
    this.setState(defaultState);
    document.getElementById("beep").pause();
    document.getElementById("beep").load();
  }
  
  modifyVal(which,type) {
    if (this.state.counting) { this.resetTimer(); }
    if (which === "break") {
      if (type === "+" && this.state.breakTime < 60) {
        this.setState(prevstate => ({ breakTime: prevstate.breakTime + 1 }));
      } else if (type === "-" && this.state.breakTime > 1) {
        this.setState(prevstate => ({ breakTime: prevstate.breakTime - 1 }));
      }
    } else if (which === "work") {
      if (type === "+" && this.state.workTime < 60) {
        let newWork = this.state.workTime + 1;
        this.setState(prevstate => ({ workTime: newWork, currentTime: newWork*60 }));
      } else if (type === "-" && this.state.workTime > 1) {
        let newWork = this.state.workTime - 1;
        this.setState(prevstate => ({ workTime: newWork, currentTime: newWork*60 }));
      }
    }
  }
  
  render () {
    return (
      <div class="clock-container" id="clock-container">
        <div class="break-times" id="break-times">
          <div class="text-box" id="break-label">Break Length</div>
          <div class="button-box" id="break-buttons">
            <button class="button" id="break-increment" onClick={() => this.modifyVal("break","+")}><i class="fa-solid fa-caret-up"/></button>
            <button class="button" id="break-decrement" onClick={() => this.modifyVal("break","-")}><i class="fa-solid fa-caret-down"/></button>
          </div>
          <div id="break-length-line"><span id="break-length">{this.state.breakTime}</span> mins</div>
        </div>
        <div class="session-times" id="session-times">
          <div class="text-box" id="session-label">Session Length</div>
          <div class="button-box" id="session-buttons">
            <button class="button" id="session-increment" onClick={() => this.modifyVal("work","+")}><i class="fa-solid fa-caret-up"/></button>
            <button class="button" id="session-decrement" onClick={() => this.modifyVal("work","-")}><i class="fa-solid fa-caret-down"/></button>
          </div>
          <div id="session-length-line"><span id="session-length">{this.state.workTime}</span> mins</div>
        </div>
        <div class="timer-container" id="timer-container">
          <div id="timer-icon"><i class={this.hardlyWorking("timer-icon")}/></div>
          <div id="timer-label">{this.hardlyWorking("state-message")}</div>
          <div id="time-left-container">
            <i class="fa-regular fa-clock" id="timer-bg"/>
            <div id="time-left">{this.formatTime(this.state.currentTime)}</div>
            <audio src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Bongo_sound.wav" id="beep"></audio>
          </div>
          <div class="button-box" id="button-box">
            <button class="button" id="start_stop" onClick={this.countDown}><i class={this.hardlyWorking("timer-control")}/></button>
            <button class="button" id="reset" onClick={this.resetTimer}><i class="fa-solid fa-rotate-left"/></button>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Pomodoro/>,document.getElementById("body"));