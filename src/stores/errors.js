import { defineStore } from "pinia";

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
      if (this.errs.length > 5) {
        this.errs = [];
      }
      this.errs.push(err);
    },
    addServerErr: function () {
      let err = this.createErr(
        "Server Error",
        "Oh! Something went wrong, Please try again.",
        "bg-warning"
      );
      this.addErr(err);
    },
    deleteAllErrs: function () {
      setTimeout(
        function (errs) {
          for (let i = 0; i < errs.length; i++){
            errs.splice(i, 1);
          }
        },
        8000,
        this.errs
      );
    },
  },
});
