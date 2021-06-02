const App = {
  data() {
    return {
      placeholderString: "Введите название заметки",
      title: "Список заметок",
      inputValue: "",
      notes: [],
      weather: "",
      url: "https://api.openweathermap.org/data/2.5/weather",
      options: {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    };
  },
  mounted() {
    this.weather = navigator.geolocation.getCurrentPosition(
      this.success,
      this.error,
      this.options
    );
    if (localStorage.getItem("notes")) {
      try {
        this.notes = JSON.parse(localStorage.getItem("notes"));
      } catch (e) {
        localStorage.removeItem("notes");
      }
    }
  },
  updated() {
    const parsed = JSON.stringify(this.notes);
    localStorage.setItem("notes", parsed);
  },
  methods: {
    addNewNote() {
      if (this.inputValue) {
        this.notes.push({ title: this.inputValue, important: false });
      }
      this.inputValue = "";
      this.saveNotes();
    },
    toUpperCase(item) {
      return item.toUpperCase();
    },
    removeNote(idx) {
      this.notes.splice(idx, 1);
      saveNotes();
    },
    doneTask(idx) {
      this.notes[idx].done = !this.notes[idx].done;
      console.log(idx);
      saveNotes();
      return this.notes;
    },
    saveNotes() {
      const parsed = JSON.stringify(this.notes);
      localStorage.setItem("notes", parsed);
    },
    success(pos) {
      let crd = pos.coords;

      this.getWeather(crd.latitude, crd.longitude);
    },
    error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    },
    getWeather: async function (latitude, longitude) {
        const res = await this.getResource(this.url, latitude, longitude)
        
        // this.weather = res
        
        // console.log(this.weather)
        this.weather = ({
            temp: res.main.temp,
            weather: res.weather[0].main,
            wind: res.wind.speed,
            sunrise: new Date(res.sys.sunrise * 1000),
            sunset: new Date(res.sys.sunset * 1000)
        })
        localStorage.setItem('weather', this.weather)
        console.log(this.weather)
    },
    getResource: async function (url, lat, long) {
      const res = await fetch(
        `${url}?lat=${lat}&lon=${long}&units=metric&appid=567e51fc59ce3eda6705c5715903c617`
      );
      if (!res.ok) {
        throw new Error(`Could not fetch, recieved ${res.status}`);
      }

      return await res.json();
    },
  },
  computed: {
    doubleCountComputed() {
      console.log("double count");
      return this.notes.length * 2;
    },
    countDoneItems() {
      const amount = this.notes.filter((item) => item.done == true).length;
      return amount;
    },
  },
};

Vue.createApp(App).mount("#app");
