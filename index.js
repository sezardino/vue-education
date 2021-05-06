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
      this.notes.push(evt.target.value);
    },
  },
};

const app = Vue.createApp(App);
app.mount("#app");
