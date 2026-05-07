

/* =======================
LIVE AMOUNT UPDATE
======================= */

const amountInput = document.getElementById("amount");

const summaryAmount = document.getElementById("summaryAmount");

const serviceFee = document.getElementById("serviceFee");

const totalAmount = document.getElementById("totalAmount");

amountInput.addEventListener("input", () => {

  const amount = parseFloat(amountInput.value) || 0;

  const fee = amount * 0.05;

  const total = amount + fee;

  summaryAmount.innerHTML = "$" + amount.toFixed(2);

  serviceFee.innerHTML = "$" + fee.toFixed(2);

  totalAmount.innerHTML = "$" + total.toFixed(2);

});

/* =======================
PAYMENT METHOD TOGGLE
======================= */

const mobileTab = document.getElementById("mobileTab");

const cardTab = document.getElementById("cardTab");

mobileTab.addEventListener("click", () => {

  mobileTab.classList.add("active");

  cardTab.classList.remove("active");

});

cardTab.addEventListener("click", () => {

  cardTab.classList.add("active");

  mobileTab.classList.remove("active");

});

/* =======================
VALIDATION
======================= */

const payBtn = document.getElementById("payBtn");

const buttonText = document.getElementById("buttonText");

payBtn.addEventListener("click", () => {

  let valid = true;

  const country = document.getElementById("country");

  const phone = document.getElementById("phone");

  const network = document.getElementById("network");

  const amount = document.getElementById("amount");

  // Errors
  const countryError =
    document.getElementById("countryError");

  const phoneError =
    document.getElementById("phoneError");

  const networkError =
    document.getElementById("networkError");

  const amountError =
    document.getElementById("amountError");

  // Reset errors
  countryError.style.display = "none";
  phoneError.style.display = "none";
  networkError.style.display = "none";
  amountError.style.display = "none";

  // COUNTRY
  if(country.value === ""){

    countryError.style.display = "block";

    valid = false;
  }

  // PHONE
  if(phone.value.trim() === ""){

    phoneError.innerHTML =
      "Mobile number field is empty";

    phoneError.style.display = "block";

    valid = false;

  } else if(phone.value.length < 8){

    phoneError.innerHTML =
      "Mobile number not validated";

    phoneError.style.display = "block";

    valid = false;
  }

  // NETWORK
  if(network.value === ""){

    networkError.style.display = "block";

    valid = false;
  }

  // AMOUNT
  if(amount.value === "" || amount.value <= 0){

    amountError.style.display = "block";

    valid = false;
  }

  /* =======================
  STOP TRANSACTION
  ======================= */

  if(!valid){

    payBtn.classList.add("error-state");

    buttonText.innerHTML =
      "Transaction On Hold";

    setTimeout(() => {

      payBtn.classList.remove("error-state");

      buttonText.innerHTML =
        "Pay Now";

    }, 2500);

    return;
  }

  /* =======================
  SUCCESS
  ======================= */

  buttonText.innerHTML =
    "Processing Payment...";

  payBtn.disabled = true;

  setTimeout(() => {

    payBtn.classList.add("success");

    buttonText.innerHTML =
      "Payment Successful";

    setTimeout(() => {

      alert("Payment completed successfully!");

      payBtn.disabled = false;

      payBtn.classList.remove("success");

      buttonText.innerHTML =
        "Pay Now";

    }, 2200);

  }, 2500);

});
