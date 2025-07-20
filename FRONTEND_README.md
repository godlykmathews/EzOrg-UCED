# 🏫 Unified College Event Dashboard - Frontend

A comprehensive React-based frontend for the Unified College Event Dashboard (UCED) system. This application provides role-based interfaces for managing college events, approvals, announcements, and communications.

## ✨ Features Implemented

### 🔐 Authentication & Role Management
- **Multi-role Login System**: Students, Community Leads, Staff Advisors, HoD, and Principal
- **Role-based Access Control**: Different UI and functionality based on user roles
- **Mock Authentication**: Demo login system (ready for Supabase integration)

### 👥 Role-Specific Dashboards

#### 🎓 Student Dashboard
- View approved events and announcements
- Access digital notice board
- Browse event details and schedules
- Personal profile management

#### 🎯 Community Lead Dashboard
- Create and submit event proposals
- Track proposal approval status
- View submission history
- Manage event details

#### 👨‍🏫 Staff Advisor Dashboard
- Review pending event proposals
- Approve/reject/request revisions
- Add comments and feedback
- Track approval history

#### 👨‍💼 Head of Department Dashboard
- Department-level event approvals
- Create announcements
- Manage departmental communications
- Oversee approval workflows

#### 👨‍🎓 Principal Dashboard
- Final event approvals
- College-wide announcements
- Comprehensive event oversight
- Policy management interface

### 📋 Core Modules

#### 📅 Event Management
- **Event Creation**: Comprehensive form with validation
- **Event Listing**: Filter and search functionality
- **Event Details**: Detailed view with approval timeline
- **Status Tracking**: Real-time approval status updates

#### ✅ Approval Workflow
- **Multi-stage Approval**: Staff Advisor → HoD → Principal
- **Comment System**: Add feedback and revision requests
- **Status Management**: Approved/Pending/Rejected states
- **Timeline View**: Track approval progress

#### 📢 Announcements
- **Creation Interface**: Rich announcement creation
- **Priority Levels**: High/Normal/Low priority system
- **Target Audience**: Role-based announcement targeting
- **Management Tools**: Edit and delete capabilities

#### 📌 Notice Board
- **Centralized Notices**: All college communications
- **Category Filtering**: Academic, Events, Technical, etc.
- **Search Functionality**: Find notices quickly
- **Expiry Management**: Time-based notice lifecycle

#### 👤 Profile Management
- **Personal Information**: Editable user profiles
- **Activity Statistics**: Role-based metrics
- **Preferences**: Notification settings
- **Contact Details**: Comprehensive contact management

## 🛠️ Technology Stack

- **Framework**: React 19.1.0 with Vite
- **Styling**: TailwindCSS with custom components
- **Routing**: React Router DOM
- **Icons**: Heroicons
- **State Management**: React Hooks (useState, useEffect)
- **Build Tool**: Vite with Hot Module Replacement

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UCED
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:` (or the port shown in terminal)

### Demo Login

The application includes a mock authentication system for testing:

1. **Student Role**: View events and announcements
2. **Community Lead**: Create and manage event proposals  
3. **Staff Advisor**: Review and approve proposals
4. **Head of Department**: Departmental approvals and announcements
5. **Principal**: Final approvals and college-wide management

Simply enter any name and select a role to experience the different interfaces.

## 📁 Project Structure

```
src/
├── components/
│   └── Layout.jsx          # Main layout with navigation
├── pages/
│   ├── Login.jsx           # Authentication page
│   ├── Dashboard.jsx       # Role-based dashboard
│   ├── Events.jsx          # Event listing and management
│   ├── EventDetail.jsx     # Detailed event view
│   ├── CreateEvent.jsx     # Event creation form
│   ├── Approvals.jsx       # Approval management
│   ├── Announcements.jsx   # Announcement system
│   ├── NoticeBoard.jsx     # Notice board interface
│   └── Profile.jsx         # User profile management
├── hooks/                  # Custom React hooks (future)
├── utils/                  # Utility functions (future)
├── App.jsx                 # Main application component
├── main.jsx               # Application entry point
└── index.css              # Global styles with TailwindCSS
```

## 🎨 UI/UX Features

### Design System
- **Consistent Color Scheme**: Role-based color coding
- **Responsive Design**: Mobile-first approach
- **Clean Interface**: Modern, intuitive user experience
- **Accessibility**: WCAG compliant components

### Interactive Elements
- **Modal Dialogs**: For forms and confirmations
- **Loading States**: Smooth user feedback
- **Status Badges**: Visual status indicators
- **Search & Filter**: Advanced data filtering
- **Responsive Tables**: Mobile-friendly data display

### Navigation
- **Sidebar Navigation**: Role-based menu items
- **Breadcrumbs**: Clear page hierarchy
- **Quick Actions**: Contextual action buttons
- **Mobile Menu**: Responsive navigation

## 🔗 Integration Ready

### Supabase Integration Points
- **Authentication**: Replace mock auth with Supabase Auth
- **Database**: Connect to Supabase tables (users, events, approvals)
- **Realtime**: Live updates for approval status changes
- **Storage**: File uploads for event documents

### API Integration
- **RESTful APIs**: Ready for backend integration
- **Error Handling**: Comprehensive error management
- **Loading States**: Built-in loading indicators
- **Data Validation**: Form validation and sanitization

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- **Desktop**: Full-featured interface
- **Tablet**: Optimized layout and navigation
- **Mobile**: Touch-friendly mobile experience

## 🔒 Security Features

- **Role-based Access**: Proper permission checking
- **Input Validation**: Client-side form validation
- **XSS Protection**: Safe content rendering
- **Authentication Flow**: Secure login/logout process

## 🚀 Future Enhancements

### Phase 2 Features
- **Real-time Notifications**: Live updates and alerts
- **File Upload**: Document and image attachments
- **Calendar Integration**: Event calendar views
- **Email System**: Automated email notifications
- **Reporting**: Analytics and reporting dashboard

### Technical Improvements
- **State Management**: Redux or Zustand integration
- **Testing**: Unit and integration tests
- **Performance**: Code splitting and optimization
- **PWA**: Progressive Web App capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `/docs` folder

---

**Built with ❤️ for educational institutions to streamline event management and communication.**
