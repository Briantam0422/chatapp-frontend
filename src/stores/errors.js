import {defineStore} from "pinia";

export const useErrorsStore = defineStore("errors", {
  state: () => {
    return {
      errs: [],
    };
  },
  getters: () => {},
  actions: {
    createErr: function (title, message, style) {
      return {
        headerTitle: title,
        message: message,
        style: style,
      };
    },
    addErr: function (err) {
      if (this.errs.length > 5){
        this.errs = [];
      }
      this.errs.push(err);
    },
  },
});
