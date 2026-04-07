from flask import Flask, render_template, request, redirect, url_for, session, flash, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from functools import wraps
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///onam_fest.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database Model for Events
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    time = db.Column(db.String(50), nullable=False)
    venue = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)

# Simple Admin Check Decorator
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_logged_in'):
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/images/<filename>')
def serve_images(filename):
    images_dir = os.path.join(os.path.dirname(__file__), 'images')
    return send_from_directory(images_dir, filename)

@app.route('/add-sample-events')
def add_sample_events():
    """Add sample events to the database"""
    # Check if events already exist
    if Event.query.first():
        return "Events already exist in the database!"
    
    sample_events = [
        Event(
            title="Pookalam Competition",
            time="9:00 AM - 12:00 PM",
            venue="College Grounds",
            description="Create beautiful flower arrangements (Pookalam) and compete for amazing prizes. Traditional art in modern times!"
        ),
        Event(
            title="Kathakali Night",
            time="6:00 PM - 8:00 PM",
            venue="Auditorium",
            description="Experience the grandeur of Kathakali, the classical dance form of Kerala. Watch spectacular performances by renowned artists and talented students."
        ),
        Event(
            title="Grand Sadya",
            time="12:00 PM - 2:00 PM",
            venue="Dining Hall",
            description="Enjoy the traditional Kerala feast with authentic dishes served on banana leaves. A culinary journey through the flavors of Kerala!"
        ),
        Event(
            title="Cultural Dance Performances",
            time="7:00 PM - 9:00 PM",
            venue="Main Stage",
            description="Dance performances including Mohiniyattam, Thiruvathira, and other traditional Kerala dance forms. Experience the vibrant culture of Kerala!"
        ),
        Event(
            title="Vallam Kali (Boat Race)",
            time="4:00 PM - 6:00 PM",
            venue="College Lake",
            description="Traditional boat races with synchronized rowing and songs. An exciting display of Kerala's maritime heritage!"
        ),
        Event(
            title="Onam Games & Sports",
            time="10:00 AM - 1:00 PM",
            venue="Sports Field",
            description="Traditional games like Ambeyali, Kuma Kumakali, and Pulikali. Fun-filled activities for everyone!"
        ),
        Event(
            title="Flower Decoration Workshop",
            time="3:00 PM - 5:00 PM",
            venue="Art Room",
            description="Learn the art of creating beautiful flower arrangements. Expert guidance on traditional techniques and modern designs."
        ),
        Event(
            title="Onam Pal (Swing Festival)",
            time="5:00 PM - 7:00 PM",
            venue="College Grounds",
            description="Traditional swinging at the temple or ceremonial grounds. Experience the joy and festivities of Onam!"
        ),
    ]
    
    for event in sample_events:
        db.session.add(event)
    
    db.session.commit()
    return "✅ Sample events added successfully! <a href='/events'>View Events</a>"

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form['username'] == 'admin' and request.form['password'] == 'onam2026':
            session['admin_logged_in'] = True
            return redirect(url_for('admin_dashboard'))
        flash('Invalid Credentials!', 'danger')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('index'))

@app.route('/events')
def user_events():
    all_events = Event.query.all()
    return render_template('events.html', events=all_events)

@app.route('/admin', methods=['GET', 'POST'])
@admin_required
def admin_dashboard():
    if request.method == 'POST':
        new_event = Event(
            title=request.form['title'],
            time=request.form['time'],
            venue=request.form['venue'],
            description=request.form['description']
        )
        db.session.add(new_event)
        db.session.commit()
        flash('Event Added Successfully!', 'success')
    
    all_events = Event.query.all()
    return render_template('admin.html', events=all_events)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)