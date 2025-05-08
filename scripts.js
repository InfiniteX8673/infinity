// Add a new subject row
function addSubject() {
  const tbody = document.getElementById("subjects");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" placeholder="Enter subject" class="subject"></td>
    <td><input type="number" min="0" max="100" placeholder="Score" class="score" oninput="updateGrade(this)"></td>
    <td class="grade"></td>
  `;
  tbody.appendChild(row);
}

function updateGrade(input) {
  const score = parseInt(input.value);
  const system = document.getElementById("system").value;
  const gradeCell = input.parentElement.nextElementSibling;
  let grade = '';

  if (isNaN(score)) {
    gradeCell.textContent = '';
    return;
  }

  if (system === "zimsec") {
    if (score >= 80) grade = "A";
    else if (score >= 70) grade = "B";
    else if (score >= 60) grade = "C";
    else if (score >= 50) grade = "D";
    else if (score >= 40) grade = "E";
    else grade = "U";
  } else {
    if (score >= 80) grade = "A";
    else if (score >= 70) grade = "B";
    else if (score >= 60) grade = "C";
    else if (score >= 50) grade = "D";
    else if (score >= 40) grade = "E";
    else grade = "F";
  }

  gradeCell.textContent = grade;
}

function updateAllGrades() {
  document.querySelectorAll(".score").forEach(updateGrade);
}

function generateReport() {
  const studentName = document.getElementById("studentName").value.trim();
  if (!studentName) {
    alert("Please enter the student's name.");
    return;
  }

  const reportNameElem = document.getElementById("reportName");
  const reportBody = document.getElementById("reportBody");
  reportNameElem.textContent = studentName;
  reportBody.innerHTML = "";

  const subjectRows = document.getElementById("subjects").children;
  if (subjectRows.length === 0) {
    alert("Please add at least one subject.");
    return;
  }

  for (let row of subjectRows) {
    const subjectInput = row.cells[0].children[0];
    const gradeCell = row.cells[2];
    const subject = subjectInput.value.trim();
    const grade = gradeCell.textContent.trim();

    if (!subject) {
      alert("Please enter all subject names.");
      return;
    }

    const reportRow = document.createElement("tr");
    reportRow.innerHTML = `<td>${subject}</td><td>${grade}</td>`;
    reportBody.appendChild(reportRow);
  }

  document.getElementById("report").classList.remove("hidden");
}

function clearReport() {
  document.getElementById("studentName").value = "";
  document.getElementById("subjects").innerHTML = "";
  document.getElementById("report").classList.add("hidden");
}

function downloadPDF() {
  const reportElem = document.getElementById("report");
  if (reportElem.classList.contains("hidden")) {
    alert("Please generate the report first!");
    return;
  }

  const studentName = document.getElementById("reportName").innerText;
  const reportBody = document.getElementById("reportBody");
  const rows = reportBody.getElementsByTagName("tr");
  const tableData = [];

  for (let row of rows) {
    const cells = row.getElementsByTagName("td");
    if (cells.length >= 2) {
      tableData.push([cells[0].innerText, cells[1].innerText]);
    }
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  pdf.setFontSize(14);
  pdf.text(`Report for: ${studentName}`, 14, 20);

  pdf.autoTable({
    head: [['Subject', 'Grade']],
    body: tableData,
    startY: 30,
    theme: 'plain',
    styles: { cellPadding: 2, fontSize: 12 }
  });

  pdf.save("School_Report.pdf");
}

// Update grades on grading system change
document.getElementById("system").addEventListener("change", updateAllGrades);

// Add ripple effect to all buttons
document.querySelectorAll("button").forEach(button => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    const oldRipple = button.querySelector(".ripple");
    if (oldRipple) oldRipple.remove();

    button.appendChild(ripple);
  });
});
