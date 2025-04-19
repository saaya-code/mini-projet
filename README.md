# UniDefense - University Defense Planning System

UniDefense is a comprehensive web application designed to streamline the planning and management of student defense sessions in academic institutions. It provides an intuitive interface for administrators, professors, and students to coordinate defense schedules efficiently.

![UniDefense Dashboard](https://placeholder.svg?height=400&width=800)

## Features

### For Administrators
- **User Management**: Create and manage professor and student accounts
- **Schedule Generation**: Automatically generate optimal defense schedules for single days or date ranges
- **Room Management**: Manage available rooms and their availability
- **Data Import/Export**: Import and export data in various formats
- **System Monitoring**: Monitor system activity and performance

### For Professors
- **Availability Management**: Set and update availability for defense participation
- **Defense Schedule**: View assigned defenses as jury president or reporter
- **Student Supervision**: Manage supervised student projects
- **Notifications**: Receive real-time notifications about schedule changes

### For Students
- **Project Management**: View and update project information
- **Defense Schedule**: Access defense details including time, location, and jury members
- **Notifications**: Receive important updates about defense scheduling

## Technical Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: NextAuth.js
- **Email**: NodeMailer
- **Deployment**: Vercel (recommended)

## Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB database
- SMTP server for email notifications

### Setup Instructions

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/unidefense.git
   cd unidefense
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Create a `.env.local` file with the following variables:
   \`\`\`
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret

   # Email (NodeMailer)
   EMAIL_SERVER_HOST=your_smtp_host
   EMAIL_SERVER_PORT=your_smtp_port
   EMAIL_SERVER_USER=your_smtp_username
   EMAIL_SERVER_PASSWORD=your_smtp_password
   EMAIL_FROM=noreply@yourdomain.com
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Access the application at `http://localhost:3000`

## Schedule Generation Algorithm

The schedule generation algorithm is the core of UniDefense. It works as follows:

### Single-Day Scheduling
1. **Input Collection**: Gathers all projects, professors, rooms, and their availability
2. **Constraint Checking**: Validates professor availability, room availability, and scheduling rules
3. **Slot Assignment**: Assigns each project to an available time slot, room, and jury members
4. **Notification**: Sends notifications to all involved parties

### Multi-Day Scheduling
1. **Date Range Processing**: Processes each workday in the selected range (excluding weekends)
2. **Project Distribution**: Distributes projects across available days based on constraints
3. **Optimization**: Ensures even distribution and maximizes resource utilization
4. **Tracking**: Tracks scheduled projects to avoid duplicates

### Key Constraints
- Professors cannot be in two defenses simultaneously
- A professor cannot be both supervisor and jury member for the same defense
- Rooms can only host one defense at a time
- Time slots include breaks between defenses
- Professors' availability is respected for each day of the week

## Database Structure

UniDefense uses MongoDB with the following main collections:

- **Users**: Authentication and user information
- **Professors**: Professor profiles and availability
- **Students**: Student information and project associations
- **Projects**: Project details and supervisor information
- **Rooms**: Room information and availability
- **Defenses**: Scheduled defense sessions
- **Notifications**: System notifications for users

## Security Features

- **Authentication**: Secure login with email/password
- **Role-Based Access**: Different permissions for administrators, professors, and students
- **Data Validation**: Input validation on both client and server
- **Password Security**: Secure password hashing and storage
- **Session Management**: Secure session handling with NextAuth.js

## Deployment

UniDefense can be deployed to various platforms:

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Deploy with a single click

### Other Platforms
- **Docker**: Containerized deployment available
- **Traditional Hosting**: Can be deployed on any Node.js hosting service

## Maintenance

### Regular Tasks
- Database backups
- Security updates
- Performance monitoring

### Troubleshooting
- Check logs for errors
- Verify database connection
- Ensure email service is functioning

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

Let's also update the CSS to ensure we have the animations we need:
