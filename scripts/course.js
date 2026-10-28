// Set completed to true only for courses you have personally completed.
const courses = [
  { subject: "WDD", number: 130, title: "Web Fundamentals", credits: 2, completed: true },
  { subject: "WDD", number: 131, title: "Dynamic Web Fundamentals", credits: 2, completed: true },
  { subject: "WDD", number: 231, title: "Web Frontend Development I", credits: 2, completed: false },
  { subject: "CSE", number: 110, title: "Introduction to Programming", credits: 2, completed: true },
  { subject: "CSE", number: 111, title: "Programming with Functions", credits: 2, completed: true },
  { subject: "CSE", number: 210, title: "Programming with Classes", credits: 2, completed: false }
];

const courseList = document.querySelector("#courseList");
const creditTotal = document.querySelector("#creditTotal");
const filterButtons = document.querySelectorAll("[data-filter]");

function displayCourses(filter = "all") {
  if (!courseList || !creditTotal) return;

  const visibleCourses = courses.filter((course) =>
    filter === "all" ? true : course.subject === filter
  );

  courseList.replaceChildren();

  visibleCourses.forEach((course) => {
    const card = document.createElement("div");
    card.className = `course-card${course.completed ? " completed" : ""}`;
    card.textContent = `${course.subject} ${course.number}`;

    const title = document.createElement("small");
    title.textContent = `${course.title} · ${course.credits} credits`;
    card.appendChild(title);

    if (course.completed) {
      card.setAttribute("aria-label", `${course.subject} ${course.number}, completed`);
      const completedLabel = document.createElement("small");
      completedLabel.textContent = "Completed";
      card.appendChild(completedLabel);
    }

    courseList.appendChild(card);
  });

  const totalCredits = visibleCourses.reduce((total, course) => total + course.credits, 0);
  creditTotal.textContent = totalCredits;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    displayCourses(filter);
  });
});

displayCourses();
