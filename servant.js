import defaultHistory from "./defaultHistory.js";

class Servant {
  // function that sets the default history
  static async setDefaultHistory(history) {
    history.length = 0;

    for (let i = 0; i < defaultHistory.length; i++) {
      history.push(defaultHistory[i]);
    }

    return history;
  }

  static countElemsToDelete(histLength, defLength, preferableValue) {
    if (preferableValue <= 0)
      throw new Error("Unable to delete this amount of elements");

    if (histLength - preferableValue > defLength + 1) {
      return preferableValue;
    } else {
      Servant.countElemsToDelete(histLength, defLength, preferableValue - 2);
    }
  }
}

export default Servant;
