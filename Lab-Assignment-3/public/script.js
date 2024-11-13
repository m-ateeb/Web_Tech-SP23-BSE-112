// Sample data for projects
const projects = {
    "FIR Management System": {
        description: "The FIR Management System is a web application that helps police departments manage and track FIRs (First Information Reports) efficiently. It includes features for reporting, searching, and tracking the status of FIRs."
    },
    "Pakola's Website": {
        description: "A modern, responsive website for Pakola, a popular beverage brand. The site includes product showcases, an online store, and user engagement features."
    },
    "Project Title 3": {
        description: "Description of Project Title 3. This project involves developing a web application that does XYZ."
    }
};

// Function to display project description
function showProjectDescription(projectName) {
    const projectInfo = projects[projectName];
    const descriptionElement = document.getElementById('project-description-content');

    if (projectInfo) {
        descriptionElement.innerHTML = `
            <h3>${projectName}</h3>
            <p>${projectInfo.description}</p>
        `;
    } else {
        descriptionElement.innerHTML = `<p>No description available.</p>`;
    }
}

// Event listeners for project buttons
document.addEventListener('DOMContentLoaded', () => {
    const projectLinks = document.querySelectorAll('.project-card a');

    if (projectLinks.length === 0) {
        console.error("No project links found!");
        return;
    }

    projectLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();  // Prevent default anchor behavior
            
            // Get the project title element
            const projectTitleElement = this.closest('.project-card').querySelector('h3');
            if (!projectTitleElement) {
                console.error("Project title element not found!");
                return;
            }

            const projectName = projectTitleElement.innerText;
            console.log(`Project selected: ${projectName}`);  // Log the selected project name
            showProjectDescription(projectName);  // Show the selected project description
        });
    });
});
