import "./css/reset.css";
import "./css/style.css";

const main = (() => {
  class DomElements {
    static form = document.querySelector("#cost-calculator-form");
    static amountResult = document.querySelector(
      ".calculation-results-container",
    );
    static settingsButton = document.querySelector("#calculator-settings-btn");
    static filamentTypeSelect = document.querySelector("#type-of-filament");
  }
  class User {
    static defaultData = {
      filamentTypes: [
        { name: "PLA", spoolPrice: 769, id: crypto.randomUUID() },
        { name: "PET", spoolPrice: 769, id: crypto.randomUUID() },
      ],
      costOfElectricity: 5.98,
      printerKWConsumption: 0.24,
    };
    static data = {};

    static filamentTypes() {
      return User.data.filamentTypes;
    }

    static loadData() {
      let dataloaded = localStorage.getItem("config-data");
      if (!dataloaded) {
        localStorage.setItem("config-data", JSON.stringify(this.defaultData));
        dataloaded = localStorage.getItem("config-data");
      }
      User.data = JSON.parse(dataloaded);
    }

    static saveData() {
      localStorage.setItem("config-data", User.data);
    }
  }

  // load data from local storage
  User.loadData();

  // add filament types to select field
  for (let filamentType of User.filamentTypes()) {
    const option = document.createElement("option");
    option.value = filamentType.id;
    option.textContent = filamentType.name;
    DomElements.filamentTypeSelect.appendChild(option);
  }

  DomElements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Form Submitted");
  });

  DomElements.settingsButton.addEventListener("clock", (event) => {
    console.log("Settings");
  });

  function calcPrintCost(filamentType, hours, minutes, seconds, grams) {
    console.log("I calc cost");
  }
})();
