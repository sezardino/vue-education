const App = {
  data() {
    return {
      title: "ToDo List",
      placeholderText: "Add todo",
      inputValue: "",
      notes: [],
    };
  },
  methods: {
    inputHandler(evt) {
      this.inputValue = evt.target.value;
    },
    submitHandler(evt) {
      evt.preventDefault();
      if (this.inputValue !== "") {
        this.notes.push(this.inputValue);
        this.inputValue = "";
      }
    },
    removeHandler(index) {
      this.notes.splice(index, 1);
    },
  },
  computed: {
    dabbledLength() {
      console.log("enter");
      return this.notes.length * 2;
    },
  },
  watch: {
    inputValue(value) {
      console.log("New value: ", value);
    },
  },
};

const app = Vue.createApp(App);
app.mount("#app");
