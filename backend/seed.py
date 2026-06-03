import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.dev')
django.setup()

from django.contrib.auth import get_user_model
from users.models import CandidateProfile, RecruiterProfile
from jobs.models import Job
from applications.models import Application
from notifications.models import Notification

User = get_user_model()

def seed_database():
    print("Clearing existing data...")
    Notification.objects.all().delete()
    Application.objects.all().delete()
    Job.objects.all().delete()
    User.objects.all().delete()

    print("Creating admin/superuser...")
    User.objects.create_superuser(username="admin", email="admin@jobfinder.com", password="Password123")

    # Defined list of 16 recruiter companies from user request
    recruiters = [
        {"username": "nexora_rec", "email": "hiring@nexora.com", "company_name": "Nexora Technologies", "website": "https://nexora.com"},
        {"username": "cloudnova_rec", "email": "hiring@cloudnova.com", "company_name": "CloudNova Systems", "website": "https://cloudnova.com"},
        {"username": "pixelcraft_rec", "email": "hiring@pixelcraft.com", "company_name": "PixelCraft Labs", "website": "https://pixelcraft.com"},
        {"username": "techsphere_rec", "email": "hiring@techsphere.com", "company_name": "TechSphere India", "website": "https://techsphere.in"},
        {"username": "datamind_rec", "email": "hiring@datamind.com", "company_name": "DataMind Analytics", "website": "https://datamind.com"},
        {"username": "infrastack_rec", "email": "hiring@infrastack.com", "company_name": "InfraStack Cloud", "website": "https://infrastack.io"},
        {"username": "skynet_rec", "email": "hiring@skynet.com", "company_name": "SkyNet Solutions", "website": "https://skynet.com"},
        {"username": "appvibe_rec", "email": "hiring@appvibe.com", "company_name": "AppVibe Studios", "website": "https://appvibe.co"},
        {"username": "crossmobile_rec", "email": "hiring@crossmobile.com", "company_name": "CrossMobile Tech", "website": "https://crossmobile.com"},
        {"username": "insightedge_rec", "email": "hiring@insightedge.com", "company_name": "InsightEdge Analytics", "website": "https://insightedge.com"},
        {"username": "aihorizon_rec", "email": "hiring@aihorizon.com", "company_name": "AI Horizon Labs", "website": "https://aihorizon.ai"},
        {"username": "buildstack_rec", "email": "hiring@buildstack.com", "company_name": "BuildStack Innovations", "website": "https://buildstack.in"},
        {"username": "designhub_rec", "email": "hiring@designhub.com", "company_name": "DesignHub Creative", "website": "https://designhub.co"},
        {"username": "testcore_rec", "email": "hiring@testcore.com", "company_name": "TestCore Systems", "website": "https://testcore.com"},
        {"username": "globaldev_rec", "email": "hiring@globaldev.com", "company_name": "GlobalDev Solutions", "website": "https://globaldev.com"},
        {"username": "cloudworks_rec", "email": "hiring@cloudworks.com", "company_name": "CloudWorks International", "website": "https://cloudworks.io"},
    ]

    recruiter_map = {}
    print("Creating recruiter accounts...")
    for r in recruiters:
        user = User.objects.create_user(
            username=r["username"],
            email=r["email"],
            password="Password123",
            role="recruiter"
        )
        profile = user.recruiter_profile
        profile.company_name = r["company_name"]
        profile.website = r["website"]
        profile.company_description = f"Leading innovations and industry standards at {r['company_name']}."
        profile.save()
        recruiter_map[r["company_name"]] = user
        print(f"Created Recruiter Company: {r['company_name']}")

    print("Creating candidate accounts...")
    candidates = [
        {
            "username": "john_doe",
            "email": "john.doe@gmail.com",
            "full_name": "John Doe",
            "skills": "React, JavaScript, Tailwind CSS, TypeScript, Next.js, Framer Motion",
            "experience": "Senior React Developer at Acme Corp (2 years)\nFrontend Engineer at StartupX (1.5 years)",
            "education": "BS in Computer Science from Stanford University",
            "github": "https://github.com/johndoe",
            "linkedin": "https://linkedin.com/in/johndoe"
        },
        {
            "username": "jane_smith",
            "email": "jane.smith@gmail.com",
            "full_name": "Jane Smith",
            "skills": "Python, Django, Django REST Framework, PostgreSQL, Redis, Docker, AWS",
            "experience": "Backend Architect at CloudScale (3 years)\nPython Developer at WebCraft (2 years)",
            "education": "MS in Software Engineering from MIT",
            "github": "https://github.com/janesmith",
            "linkedin": "https://linkedin.com/in/janesmith"
        }
    ]

    candidate_instances = []
    for c in candidates:
        user = User.objects.create_user(
            username=c["username"],
            email=c["email"],
            password="Password123",
            role="candidate"
        )
        profile = user.candidate_profile
        profile.full_name = c["full_name"]
        profile.skills = c["skills"]
        profile.experience = c["experience"]
        profile.education = c["education"]
        profile.github = c["github"]
        profile.linkedin = c["linkedin"]
        profile.save()
        candidate_instances.append(user)
        print(f"Created Candidate User: {c['full_name']}")

    print("Creating 16 Job Listings matching requested sample data...")
    # List of 16 jobs from user request mapped to recruiter instances
    jobs = [
        # Tech Jobs
        {
            "recruiter": recruiter_map["Nexora Technologies"],
            "title": "Full Stack Developer",
            "description": "Build scalable web applications using React and Django. Work with APIs, databases, and cloud deployment.",
            "requirements": "Solid experience in Python/Django and modern React.\nAbility to design relational databases (PostgreSQL/SQLite).\nExperience in writing clean RESTful APIs with DRF.",
            "salary_min": 800000.00,
            "salary_max": 1800000.00,
            "location_type": "hybrid",
            "location": "Bengaluru, India",
            "job_type": "full_time"
        },
        {
            "recruiter": recruiter_map["CloudNova Systems"],
            "title": "Backend Developer (Django)",
            "description": "Develop REST APIs, manage databases, and build high-performance backend systems using Django and PostgreSQL.",
            "requirements": "Proficiency in Django framework, Python, and ORM interfaces.\nFamiliarity with query optimizations and index tunings.\nKnowledge of containerization (Docker) is a plus.",
            "salary_min": 600000.00,
            "salary_max": 1500000.00,
            "location_type": "onsite",
            "location": "Chennai, India",
            "job_type": "full_time"
        },
        {
            "recruiter": recruiter_map["PixelCraft Labs"],
            "title": "Frontend Developer (React)",
            "description": "Build modern UI components using React, Tailwind CSS, and Framer Motion.",
            "requirements": "Strong hold on HTML5, CSS3, ES6 JavaScript, and React hooks.\nKnowledge of TailwindCSS utilities and CSS variables.\nExperience creating high-fidelity micro-animations with Framer Motion.",
            "salary_min": 500000.00,
            "salary_max": 1200000.00,
            "location_type": "remote",
            "location": "Hyderabad, India",
            "job_type": "full_time"
        },
        {
            "recruiter": recruiter_map["TechSphere India"],
            "title": "MERN Stack Developer",
            "description": "Develop full-stack applications using MongoDB, Express, React, Node.js.",
            "requirements": "Hands-on experience in MERN stack architectures.\nExpertise in database schemas with MongoDB and Express middlewares.\nWriting reusable components in React.",
            "salary_min": 700000.00,
            "salary_max": 1600000.00,
            "location_type": "hybrid",
            "location": "Mumbai, India",
            "job_type": "full_time"
        },
        {
            "recruiter": recruiter_map["DataMind Analytics"],
            "title": "Python Developer",
            "description": "Work on data pipelines, automation scripts, and backend services using Python.",
            "requirements": "Familiarity with Python algorithms, data structures, and script automations.\nExperience in pandas/numpy or scripting libraries.\nFamiliarity with Git and Linux shells.",
            "salary_min": 600000.00,
            "salary_max": 1400000.00,
            "location_type": "onsite",
            "location": "Delhi, India",
            "job_type": "full_time"
        },
        # Cloud / DevOps
        {
            "recruiter": recruiter_map["InfraStack Cloud"],
            "title": "DevOps Engineer",
            "description": "Manage CI/CD pipelines, Docker, Kubernetes, AWS infrastructure.",
            "requirements": "Expertise in Jenkins, GitHub Actions, or GitLab CI.\nExperience orchestrating with Kubernetes and containerizing with Docker.\nManaging AWS resources and Linux administrations.",
            "salary_min": 1000000.00,
            "salary_max": 2200000.00,
            "location_type": "hybrid",
            "location": "Bengaluru, India",
            "job_type": "full_time"
        },
        {
            "recruiter": recruiter_map["SkyNet Solutions"],
            "title": "Cloud Engineer (AWS)",
            "description": "Design and manage scalable cloud infrastructure using AWS services.",
            "requirements": "AWS Certified SysOps Administrator or Solutions Architect associate.\nKnowledge of Terraform or CloudFormation for Infrastructure as Code (IaC).\nMonitoring cloud budgets, access locks, and VPC setups.",
            "salary_min": 1200000.00,
            "salary_max": 2500000.00,
            "location_type": "remote",
            "location": "Remote",
            "job_type": "full_time"
        },
        # Mobile Dev
        {
            "recruiter": recruiter_map["AppVibe Studios"],
            "title": "Android Developer",
            "description": "Build Android apps using Kotlin and integrate REST APIs.",
            "requirements": "Proficiency in Android Studio, SDK, Kotlin, and coroutines.\nConnecting clean MVVM network architectures with Retrofit.\nPublishing apps to Google Play Store.",
            "salary_min": 500000.00,
            "salary_max": 1200000.00,
            "location_type": "onsite",
            "location": "Chennai, India",
            "job_type": "full_time"
        },
        {
            "recruiter": recruiter_map["CrossMobile Tech"],
            "title": "Flutter Developer",
            "description": "Develop cross-platform mobile apps using Flutter and Dart.",
            "requirements": "1+ years of building production Dart/Flutter components.\nStrong handling of Flutter state architectures (Bloc, Provider, or Riverpod).\nDeploying apps to both iOS and Android stores.",
            "salary_min": 600000.00,
            "salary_max": 1400000.00,
            "location_type": "hybrid",
            "location": "Bengaluru, India",
            "job_type": "full_time"
        },
        # Data / AI
        {
            "recruiter": recruiter_map["InsightEdge Analytics"],
            "title": "Data Analyst",
            "description": "Analyze datasets, create dashboards, and generate business insights.",
            "requirements": "High SQL querying capability.\nExperience building dynamic dashboards in Tableau or PowerBI.\nStrong data-driven presentation skills.",
            "salary_min": 600000.00,
            "salary_max": 1300000.00,
            "location_type": "remote",
            "location": "Hyderabad, India",
            "job_type": "full_time"
        },
        {
            "recruiter": recruiter_map["AI Horizon Labs"],
            "title": "Machine Learning Engineer",
            "description": "Build ML models, train AI systems, and deploy intelligent solutions.",
            "requirements": "Solid hold on Python, PyTorch, or TensorFlow.\nExperience preparing training weights and custom data inputs.\nFamiliarity with model deployment microservices.",
            "salary_min": 1200000.00,
            "salary_max": 3000000.00,
            "location_type": "hybrid",
            "location": "Bengaluru, India",
            "job_type": "full_time"
        },
        # General / PM / Design
        {
            "recruiter": recruiter_map["BuildStack Innovations"],
            "title": "Product Manager",
            "description": "Lead product development, define roadmap, and coordinate engineering teams.",
            "requirements": "Excellent product scoping and user interview methodologies.\nExperience using Jira, linear, or agile sprint management boards.\nScoping feature timelines and technical specs with engineering leads.",
            "salary_min": 1500000.00,
            "salary_max": 3500000.00,
            "location_type": "hybrid",
            "location": "Mumbai, India",
            "job_type": "full_time"
        },
        {
            "recruiter": recruiter_map["DesignHub Creative"],
            "title": "UI/UX Designer",
            "description": "Design modern SaaS interfaces using Figma and user-centered design principles.",
            "requirements": "Pristine Figma design layouts, visual design tokens, and components library management.\nExperience creating detailed wireframes and prototypes.\nStrong aesthetic control in SaaS dark/light structures.",
            "salary_min": 500000.00,
            "salary_max": 1000000.00,
            "location_type": "remote",
            "location": "Delhi, India",
            "job_type": "full_time"
        },
        {
            "recruiter": recruiter_map["TestCore Systems"],
            "title": "QA Engineer",
            "description": "Perform manual and automated testing for web applications.",
            "requirements": "Familiarity with manual testing, write detailed test plans.\nWriting automated scripts in Selenium or Playwright.\nExperience in API testing with Postman.",
            "salary_min": 400000.00,
            "salary_max": 900000.00,
            "location_type": "onsite",
            "location": "Chennai, India",
            "job_type": "full_time"
        },
        # Remote Only
        {
            "recruiter": recruiter_map["GlobalDev Solutions"],
            "title": "Remote Full Stack Developer",
            "description": "Work on international SaaS products using modern web technologies.",
            "requirements": "Fluent English speaker. Remote-native worker.\n3+ years experience across React/Typescript and Node/Python backend APIs.\nReliable internet and flexible workspace timezone compatibility.",
            "salary_min": 40000.00,
            "salary_max": 90000.00,
            "location_type": "remote",
            "location": "Remote",
            "job_type": "full_time"
        },
        {
            "recruiter": recruiter_map["CloudWorks International"],
            "title": "Remote Backend Engineer",
            "description": "Build scalable APIs and microservices for global platforms.",
            "requirements": "Strong system architectural skills, designing microservices.\nExperience in PostgreSQL scaling, connection pooling, and queue systems (Celery/Redis).\nFamiliarity with Kubernetes cluster structures.",
            "salary_min": 50000.00,
            "salary_max": 100000.00,
            "location_type": "remote",
            "location": "Remote",
            "job_type": "full_time"
        }
    ]

    job_instances = []
    for j in jobs:
        job = Job.objects.create(**j)
        job_instances.append(job)
        print(f"Created Job: '{j['title']}' at {j['recruiter'].recruiter_profile.company_name}")

    print("Creating sample job applications...")
    # John Doe applies to Nexora Technologies Full Stack and PixelCraft Labs Frontend
    app1 = Application.objects.create(
        job=job_instances[0], # Nexora Full Stack
        candidate=candidate_instances[0], # John Doe
        cover_letter="I am a highly motivated React/Django developer. I would love to build products for Nexora Technologies.",
        status="shortlisted"
    )
    app2 = Application.objects.create(
        job=job_instances[2], # PixelCraft Frontend
        candidate=candidate_instances[0], # John Doe
        cover_letter="React frontend design is my calling. Framer Motion and TailwindCSS v4 are my specialties.",
        status="pending"
    )

    # Jane Smith applies to CloudNova Backend and InfraStack DevOps
    app3 = Application.objects.create(
        job=job_instances[1], # CloudNova Backend
        candidate=candidate_instances[1], # Jane Smith
        cover_letter="I am a veteran Django backend developer with deep experience in Postgres and scalable APIs.",
        status="pending"
    )
    app4 = Application.objects.create(
        job=job_instances[5], # InfraStack DevOps
        candidate=candidate_instances[1], # Jane Smith
        cover_letter="Infrastructure as Code and CI/CD pipelines are my primary domain. I would love to manage InfraStack's clusters.",
        status="hired"
    )

    print("Creating sample notifications...")
    # Notify John about Nexora shortlisting
    Notification.objects.create(
        user=candidate_instances[0],
        title="Application Update",
        message="Your application status for 'Full Stack Developer' at Nexora Technologies is now: Shortlisted.",
        notification_type="status_change",
        related_id=app1.id
    )
    # Notify Jane about InfraStack hiring
    Notification.objects.create(
        user=candidate_instances[1],
        title="Application Update",
        message="Your application status for 'DevOps Engineer' at InfraStack Cloud is now: Hired.",
        notification_type="status_change",
        related_id=app4.id
    )

    # Notify CloudNova recruiter about Jane's application
    Notification.objects.create(
        user=recruiter_map["CloudNova Systems"],
        title="New Application Received",
        message="Jane Smith has applied for your job 'Backend Developer (Django)'.",
        notification_type="application_received",
        related_id=app3.id
    )

    print("Successfully seeded the database with 16 jobs!")

if __name__ == '__main__':
    seed_database()
