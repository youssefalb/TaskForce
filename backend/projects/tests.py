from datetime import datetime
from django.test import TestCase
from .models import Project, Ticket, Record, CustomUser, Role, ProjectUserRole

class ProjectModelTest(TestCase):
    def setUp(self):
        self.project = Project.objects.create(
            title="Advanced Project",
            description="Project Description",
            start_date="2021-01-01",
            end_date="2021-12-31",
            status='not_started'
        )

    def test_project_creation(self):
        project = Project.objects.get(id=self.project.id)
        self.assertEqual(project.title, "Advanced Project")
        # More assertions

class TicketModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(username='testuser', email='test@example.com')
        self.project = Project.objects.create(
            title="Ticket Project",
            description="Project Description",
            start_date="2021-01-01",
            end_date="2021-12-31",
            status='not_started'
        )
        self.ticket = Ticket.objects.create(
            title="Test Ticket",
            description="Ticket Description",
            project=self.project,
            created_by=self.user,
            status='open',
            priority='medium'
        )

    def test_ticket_creation(self):
        ticket = Ticket.objects.get(id=self.ticket.id)
        self.assertEqual(ticket.title, "Test Ticket")
        # More assertions

class RecordModelTest(TestCase):
    def setUp(self):
        self.project = Project.objects.create(
            title="Advanced Project",
            description="Project Description",
            start_date="2021-01-01",
            end_date="2021-12-31",
            status='not_started'
        )
        self.user = CustomUser.objects.create(username='recorduser', email='recorduser@example.com')
        self.ticket = Ticket.objects.create(
            title="Record Ticket",
            project=self.project,  # Assuming self.project is created in setUp
            created_by=self.user,
            status='open',
            priority='medium'
        )
        self.record = Record.objects.create(
            user=self.user,
            ticket=self.ticket,
            start_date=datetime(2021, 1, 1, 0, 0),
            end_date=datetime(2021, 1, 1, 1, 0)
        )

    def test_record_duration_calculation(self):
        record = Record.objects.get(id=self.record.id)
        self.assertIsNotNone(record.hours_worked)
class CustomUserModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(username='verifieduser', email='verified@example.com')

    def test_user_creation(self):
        user = CustomUser.objects.get(id=self.user.id)
        self.assertEqual(user.username, 'verifieduser')
