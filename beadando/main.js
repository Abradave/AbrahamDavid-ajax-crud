import "bootstrap/dist/css/bootstrap.css";
import "./style.css";

const api_url = "https://retoolapi.dev/DK0QAZ/data"

document.addEventListener("DOMContentLoaded", () => {
  const personForm = document.getElementById("personForm");
  const resetButton = document.getElementById("resetButton");
  resetButton.addEventListener("click", resetForm);
  personForm.addEventListener("submit", handleFormSubmit);
  listAccounts();
});

function handleFormSubmit(event) {
  event.preventDefault();
  const id = document.getElementById("id").value;
  const fname = document.getElementById('Fname').value;
  const lname = document.getElementById('Lname').value;
  const cardNum = document.getElementById('CardNum').value;
  const cvv = document.getElementById('cvv').value;
  const creditScore = document.getElementById('CreditScore').value;
  const created = document.getElementById('Created').value;
  const person = {
    fname: fname,
    lname: lname,
    cardNum: cardNum,
    cvv: cvv,
    creditScore: creditScore,
    created: created
  };
  if (id == "") {
    addAccount(person);
  } else {
    updateAccount(id, person);
  }
}

async function updateAccount(id, person) {
  const response = await fetch(`${api_url}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(person),
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (response.ok) {
    resetForm();
    listAccounts();
  }
}

async function addAccount(person) {
  console.log(person);
  console.log(JSON.stringify(person));

  const response = await fetch(api_url, {
    method: "POST",
    body: JSON.stringify(person),
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (response.ok) {
    listAccounts();
    resetForm();
  }
}

function resetForm() {
  document.getElementById('id').value = "";
  document.getElementById('Lname').value = "";
  document.getElementById('Fname').value = "";
  document.getElementById('CardNum').value = "";
  document.getElementById('cvv').value = "";
  document.getElementById('CreditScore').value = "";
  document.getElementById('Created').value = "";
  document.getElementById("updateButton").classList.add('hide');
  document.getElementById("submitButton").classList.remove('hide');
}

function listAccounts() {
  const accounts = document.getElementById("Accounts");
  fetch(api_url).then(httpResponse => httpResponse.json())

    .then(responseBody => {
      accounts.innerHTML = "";
      responseBody.forEach(person => {
        const tr = document.createElement("tr");
        const idtd = document.createElement("td");
        const lnametd = document.createElement("td");
        const fnametd = document.createElement("td");
        const cardNumtd = document.createElement("td");
        const cvvtd = document.createElement("td");
        const creditScoretd = document.createElement("td");
        const created = document.createElement("td");

        const actionsTableData = document.createElement("td");
        const updateButton = document.createElement("button");
        updateButton.classList.add("btn", "btn-info")
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-danger")
        updateButton.textContent = "Módosít";
        deleteButton.textContent = "Törlés";
        updateButton.addEventListener("click", () => fillUpdateForm(person.id));
        deleteButton.addEventListener("click", () => deleteAccount(person.id));
        actionsTableData.appendChild(updateButton)
        actionsTableData.appendChild(deleteButton)

        idtd.textContent = person.id;
        lnametd.textContent = person.lname;
        fnametd.textContent = person.fname;
        cardNumtd.textContent = person.cardNum;
        cvvtd.textContent = person.cvv;
        creditScoretd.textContent = person.creditScore;
        created.textContent = person.created;
        tr.appendChild(idtd);
        tr.appendChild(lnametd);
        tr.appendChild(fnametd);
        tr.appendChild(cardNumtd);
        tr.appendChild(cvvtd);
        tr.appendChild(creditScoretd);
        tr.appendChild(actionsTableData);
        accounts.appendChild(tr);
      });
    });
}

async function deleteAccount(id) {
  const response = await fetch(`${api_url}/${id}`, { method: "DELETE" });
  console.log(response);
  console.log(await response.text());
  if (response.ok) {
    listAccounts();
  }
}

async function fillUpdateForm(id) {
  const response = await fetch(`${api_url}/${id}`);
  if (!response.ok) {
    alert("Hiba történt az adatok lekérése során");
    return;
  }
  const person = await response.json();
  document.getElementById("id").value = person.id;
  document.getElementById("Fname").value = person.fname;
  document.getElementById("Lname").value = person.lname;
  document.getElementById("CardNum").value = person.cardNum;
  document.getElementById("cvv").value = person.cvv;
  document.getElementById("CreditScore").value = person.creditScore;
  document.getElementById("Created").value = person.created;
  document.getElementById("submitButton").classList.add('hide');
  document.getElementById("updateButton").classList.remove('hide');
}