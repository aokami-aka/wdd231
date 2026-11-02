const memberDirectory = document.querySelector("#memberDirectory");
const directoryStatus = document.querySelector("#directoryStatus");
const gridButton = document.querySelector("#gridButton");
const listButton = document.querySelector("#listButton");

function createMemberCard(member) {
    const card = document.createElement("article");
    card.className = "member-card";

    // Business heading
    const heading = document.createElement("div");
    heading.className = "member-heading";

    const name = document.createElement("h2");
    name.textContent = member.name;

    const tagline = document.createElement("p");
    tagline.textContent = member.tagline;

    heading.append(name, tagline);

    // Business details
    const details = document.createElement("div");
    details.className = "member-details";

    // Image wrapper
    const imageFrame = document.createElement("div");
    imageFrame.className = "member-logo-frame";

    const image = document.createElement("img");
    image.className = "member-logo";
    image.src = `images/${member.image}`;
    image.alt = `${member.name} logo`;
    image.loading = "lazy";
    image.width = 240;
    image.height = 160;

    imageFrame.appendChild(image);

    // Business information
    const info = document.createElement("div");
    info.className = "member-info";

    // Address
    const address = document.createElement("p");

    const addressLabel = document.createElement("strong");
    addressLabel.textContent = "Address: ";

    address.append(
        addressLabel,
        document.createTextNode(member.address)
    );

    // Phone
    const phone = document.createElement("p");

    const phoneLabel = document.createElement("strong");
    phoneLabel.textContent = "Phone: ";

    phone.append(
        phoneLabel,
        document.createTextNode(member.phone)
    );

    // Website
    const website = document.createElement("p");

    const websiteLabel = document.createElement("strong");
    websiteLabel.textContent = "Website: ";

    const websiteLink = document.createElement("a");
    websiteLink.href = member.website;
    websiteLink.textContent = "Visit website";
    websiteLink.target = "_blank";
    websiteLink.rel = "noopener noreferrer";

    website.append(websiteLabel, websiteLink);

    // Membership level
    const membership = document.createElement("span");
    membership.className = "membership";

    const levels = {
        1: "Member",
        2: "Silver Member",
        3: "Gold Member"
    };

    membership.textContent =
        levels[member.membershipLevel] ?? "Member";

    // Assemble card
    info.append(address, phone, website, membership);
    details.append(imageFrame, info);
    card.append(heading, details);

    return card;
}

// Fetch members from JSON
async function getMembers() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const members = await response.json();

        memberDirectory.replaceChildren();

        members.forEach((member) => {
            memberDirectory.appendChild(createMemberCard(member));
        });

        directoryStatus.textContent =
            `${members.length} chamber members`;

    } catch (error) {
        console.error("Unable to load chamber members:", error);

        directoryStatus.textContent =
            "The member directory could not be loaded. Please try again later.";
    }
}

// Change between grid and list
function setDirectoryView(view) {
    const isGrid = view === "grid";

    memberDirectory.classList.toggle("list-view", !isGrid);

    gridButton.classList.toggle("active", isGrid);
    listButton.classList.toggle("active", !isGrid);

    gridButton.setAttribute("aria-pressed", String(isGrid));
    listButton.setAttribute("aria-pressed", String(!isGrid));
}

// Event listeners
gridButton.addEventListener("click", () => {
    setDirectoryView("grid");
});

listButton.addEventListener("click", () => {
    setDirectoryView("list");
});

// Initial loading
getMembers();