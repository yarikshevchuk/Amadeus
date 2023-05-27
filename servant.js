import defaultHistory from "./history/defaultHistory.js";

class Servant {
  // function that sets the default history
  static async setDefaultHistory(history) {
    history.length = 0;

    for (let i = 0; i < defaultHistory.length; i++) {
      history.push(defaultHistory[i]);
    }

    return history;
  }

  // if we want to clear the history, we need to know, how much to delete
  static countElemsToDelete(histLength, defLength, preferableValue) {
    if (preferableValue < 0)
      throw new Error("Unable to delete this amount of elements");
    if (preferableValue == 0) return 1;

    if (histLength - preferableValue > defLength + 1) {
      return preferableValue;
    } else {
      Servant.countElemsToDelete(histLength, defLength, preferableValue - 2);
    }
  }

  // used to know, when to annul used tokens
  static getNextMonth() {
    let nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    nextMonth.setHours(0, 0, 0, 0);

    let timestamp = nextMonth.getTime();
    return timestamp;
  }
}

export default Servant;
