import "./css/reset.css";
import "./css/style.css";

const main = (() => {
  class DomElements {
    static form = document.querySelector("#cost-calculator-form");
    static costResultContainer = document.querySelector(
      ".calculation-results-container",
    );
    static settingsButton = document.querySelector("#calculator-settings-btn");
    static filamentTypeSelect = document.querySelector("#type-of-filament");
    static filamentAmountInput = document.querySelector("#filament-amount");
    static timeAmountHoursInput = document.querySelector("#time-amount-hours");
    static timeAmountMinutesInput = document.querySelector(
      "#time-amount-minutes",
    );
    static timeAmountSecondsInput = document.querySelector(
      "#time-amount-seconds",
    );

    static addSelectOptions() {
      for (let filamentType of User.filamentTypes()) {
        const option = document.createElement("option");
        option.value = filamentType.id;
        option.textContent = filamentType.name;
        DomElements.filamentTypeSelect.appendChild(option);
      }
    }
  }
  class User {
    static defaultData = {
      filamentTypes: [
        {
          name: "PLA",
          spoolPrice: 769,
          id: crypto.randomUUID(),
          maintenanceRate: 6.25,
        },
      ],
      costOfKWH: 5.98,
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

    static getFilamentById(filamentId) {
      let filamentType = {};
      User.filamentTypes().forEach((element) => {
        if (element.id === filamentId) {
          filamentType = element;
        }
      });
      return filamentType;
    }
  }

  // load data from local storage
  User.loadData();
  DomElements.addSelectOptions();

  function showError(element, errorMessage) {
    const errorContainer =
      element.parentElement.querySelector(".error-message");
    errorContainer.textContent = errorMessage;
  }

  function validInputs() {
    // check validity of filament Amount
    let valid = true;
    if (!DomElements.filamentAmountInput.validity.valid) {
      if (+DomElements.filamentAmountInput.value < 0) {
        showError(
          DomElements.filamentAmountInput,
          "Cantidad tiene que ser mayor que 0",
        );
      } else {
        showError(
          DomElements.filamentAmountInput,
          "Tienes que agregar un valor valido",
        );
      }
      valid = false;
    } else {
      showError(DomElements.filamentAmountInput, "");
    }

    if (DomElements.filamentTypeSelect.value === "") {
      showError(
        DomElements.filamentTypeSelect,
        "Tienes que seleccionar un filamento",
      );
      valid = false;
    } else {
      showError(DomElements.filamentTypeSelect, "");
    }

    if (!DomElements.timeAmountSecondsInput.validity.valid) {
      if (+DomElements.timeAmountSecondsInput.value < 0) {
        showError(
          DomElements.timeAmountSecondsInput,
          "Segundos tiene que ser mayor o igual que 0",
        );
      } else {
        showError(
          DomElements.timeAmountSecondsInput,
          "Tienes que agregar un valor valido",
        );
      }
      valid = false;
    } else {
      showError(DomElements.timeAmountSecondsInput, "");
    }

    if (!DomElements.timeAmountHoursInput.validity.valid) {
      if (+DomElements.timeAmountHoursInput.value < 0) {
        showError(
          DomElements.timeAmountHoursInput,
          "Horas tiene que ser mayor o igual que 0",
        );
      } else {
        showError(
          DomElements.timeAmountHoursInput,
          "Tienes que agregar un valor valido",
        );
      }
      valid = false;
    } else {
      showError(DomElements.timeAmountHoursInput, "");
    }

    if (!DomElements.timeAmountMinutesInput.validity.valid) {
      if (+DomElements.timeAmountMinutesInput.value < 0) {
        showError(
          DomElements.timeAmountMinutesInput,
          "Minutos tiene que ser mayor o igual que 0",
        );
      } else {
        showError(
          DomElements.timeAmountMinutesInput,
          "Tienes que agregar un valor valido",
        );
      }
      valid = false;
    } else {
      showError(DomElements.timeAmountMinutesInput, "");
    }

    if (
      DomElements.timeAmountHoursInput.value === "00" &&
      DomElements.timeAmountMinutesInput.value === "00" &&
      DomElements.timeAmountSecondsInput.value === "00"
    ) {
      showError(
        DomElements.timeAmountHoursInput,
        "Tienes que ingresar un tiempo",
      );
      showError(
        DomElements.timeAmountMinutesInput,
        "Tienes que ingresar un tiempo",
      );
      showError(
        DomElements.timeAmountSecondsInput,
        "Tienes que ingresar un tiempo",
      );
      valid = false;
    } else {
      showError(DomElements.timeAmountHoursInput, "");
      showError(DomElements.timeAmountMinutesInput, "");
      showError(DomElements.timeAmountSecondsInput, "");
    }

    return valid;
  }

  DomElements.form.addEventListener("submit", (event) => {
    if (DomElements.timeAmountHoursInput.value === "") {
      DomElements.timeAmountHoursInput.value = "00";
    }
    if (DomElements.timeAmountMinutesInput.value === "") {
      DomElements.timeAmountMinutesInput.value = "00";
    }
    if (DomElements.timeAmountSecondsInput.value === "") {
      DomElements.timeAmountSecondsInput.value = "00";
    }

    event.preventDefault();
    if (validInputs()) {
      const hours = +DomElements.timeAmountHoursInput.value;
      const minutes = +DomElements.timeAmountMinutesInput.value;
      const seconds = +DomElements.timeAmountSecondsInput.value;

      const filamentId = DomElements.filamentTypeSelect.value;
      const filamentType = User.getFilamentById(filamentId);

      const grams = +DomElements.filamentAmountInput.value;

      const printCost = calcPrintCost(
        filamentType,
        hours,
        minutes,
        seconds,
        grams,
      );

      showCostResult(printCost);
    }
  });

  function showCostResult(cost) {
    DomElements.costResultContainer.querySelector("p").textContent = cost;
  }

  DomElements.settingsButton.addEventListener("clock", (event) => {
    console.log("Settings");
  });

  function calcPrintCost(filamentType, hours, minutes, seconds, grams) {
    // calculate costs
    const totalHours = hours + minutes / 60 + seconds / 3600;
    const electricityCost =
      totalHours * User.data.printerKWConsumption * User.data.costOfKWH;
    const materialCost = filamentType.spoolPrice * (grams / 1000);
    const maintenanceCost = filamentType.maintenanceRate * totalHours;
    const totalCost = electricityCost + materialCost + maintenanceCost;
    return (Math.round(totalCost * 100) / 100).toFixed(2);
  }
})();
