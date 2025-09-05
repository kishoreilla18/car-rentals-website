// Dashboard JavaScript

// Sample car data
const cars = [
    {
        id: 1,
        name: "Toyota Camry",
        type: "sedan",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsNo76DZPImAqnttdFnFkEMW15RCOHSSgfHw&s",
        price: 2500,
        features: ["Automatic", "Petrol", "5 Seater", "AC", "GPS"],
        rating: 4.5,
        available: true,
        details: "Comfortable sedan perfect for city drives and long trips.",
        transmission: "automatic",
        fuel: "petrol",
        seats: 5
    },
    {
        id: 2,
        name: "Honda City",
        type: "sedan",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxr5P7h8o4k1Jz7zk5jI9nKZ8cL4mR2sT6vQ&s",
        price: 2200,
        features: ["Manual", "Petrol", "5 Seater", "AC", "Bluetooth"],
        rating: 4.3,
        available: true,
        details: "Reliable and fuel-efficient sedan for everyday use.",
        transmission: "manual",
        fuel: "petrol",
        seats: 5
    },
    {
        id: 3,
        name: "Maruti Swift",
        type: "hatchback",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmpWf2yfVZFCnTCFmkZ_MN8CS7FWIRApXVHw&s",
        price: 1800,
        features: ["Manual", "Petrol", "4 Seater", "AC", "Music System"],
        rating: 4.2,
        available: true,
        details: "Compact and economical hatchback perfect for city driving.",
        transmission: "manual",
        fuel: "petrol",
        seats: 4
    },
    {
        id: 4,
        name: "Hyundai Creta",
        type: "suv",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqziq8mO6AREXL6uOZoRq83ZO3dolMIEqVeg&s",
        price: 3500,
        features: ["Automatic", "Diesel", "7 Seater", "AC", "Sunroof"],
        rating: 4.6,
        available: true,
        details: "Spacious SUV ideal for family trips and adventures.",
        transmission: "automatic",
        fuel: "diesel",
        seats: 7
    },
    {
        id: 5,
        name: "Tata Nexon EV",
        type: "electric",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3rj8I5mn3dFL9TA-Ny8EalfAR1eSea-7Z0Q&s",
        price: 2800,
        features: ["Automatic", "Electric", "5 Seater", "AC", "Touchscreen"],
        rating: 4.4,
        available: true,
        details: "Eco-friendly electric SUV with modern features.",
        transmission: "automatic",
        fuel: "electric",
        seats: 5
    },
    {
        id: 6,
        name: "Mahindra XUV700",
        type: "suv",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1P2YzL3jQ9cF5rK8nM7oP6tH9bR4vX2sY1w&s",
        price: 4200,
        features: ["Automatic", "Diesel", "7 Seater", "AC", "4WD"],
        rating: 4.7,
        available: false,
        details: "Premium SUV with advanced safety and comfort features.",
        transmission: "automatic",
        fuel: "diesel",
        seats: 7
    },
    {
        id: 7,
        name: "Maruti Baleno",
        type: "hatchback",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8wR5vL2kN9sF7mP1oQ3cH6tY4uI8xZ7bV2e&s",
        price: 2000,
        features: ["Manual", "Petrol", "5 Seater", "AC", "Apple CarPlay"],
        rating: 4.1,
        available: true,
        details: "Stylish hatchback with premium interior and features.",
        transmission: "manual",
        fuel: "petrol",
        seats: 5
    },
    {
        id: 8,
        name: "BMW 3 Series",
        type: "sedan",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6sM4fK8tL9uN2vP7oQ5cH1yX3zB6nR8sT4w&s",
        price: 8500,
        features: ["Automatic", "Petrol", "5 Seater", "AC", "Luxury"],
        rating: 4.8,
        available: true,
        details: "Luxury sedan with premium comfort and performance.",
        transmission: "automatic",
        fuel: "petrol",
        seats: 5
    }
];

// Global variables
let currentUser = {};
let filteredCars = [...cars];
let currentView = 'grid';
let selectedCar = null;
let bookings = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    loadCars();
    setupEventListeners();
});

// Initialize dashboard
function initializeDashboard() {
    // Load user data
    const userData = localStorage.getItem('savedUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        document.getElementById('userName').textContent = currentUser.username || 'User';
    } else {
        // Redirect to login if no user data
        window.location.href = 'login.html';
        return;
    }

    // Load existing bookings
    const savedBookings = localStorage.getItem('carBookings');
    if (savedBookings) {
        bookings = JSON.parse(savedBookings);
    }

    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    document.getElementById('startDate').value = today;
    document.getElementById('endDate').value = tomorrow;
}

// Setup event listeners
function setupEventListeners() {
    // Filter change events
    document.getElementById('carType').addEventListener('change', filterCars);
    document.getElementById('priceRange').addEventListener('change', filterCars);
    
    // Checkbox filters
    const checkboxes = document.querySelectorAll('.form-check-input');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterCars);
    });

    // Booking date change events
    document.getElementById('bookingStartDate').addEventListener('change', calculateTotal);
    document.getElementById('bookingEndDate').addEventListener('change', calculateTotal);
}

// Load and display cars
function loadCars() {
    const carListings = document.getElementById('carListings');
    carListings.innerHTML = '';

    if (filteredCars.length === 0) {
        carListings.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-car fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No cars found</h4>
                <p class="text-muted">Try adjusting your filters or search criteria.</p>
            </div>
        `;
        return;
    }

    filteredCars.forEach((car, index) => {
        const carCard = createCarCard(car, index);
        carListings.appendChild(carCard);
    });
}

// Create car card element
function createCarCard(car, index) {
    const col = document.createElement('div');
    col.className = currentView === 'grid' ? 'col-md-6 col-lg-4' : 'col-12';

    const availabilityBadge = car.available 
        ? '<span class="availability-badge">Available</span>'
        : '<span class="availability-badge unavailable">Not Available</span>';

    const rating = generateStars(car.rating);
    const features = car.features.map(feature => 
        `<span class="feature-badge">${feature}</span>`
    ).join('');

    col.innerHTML = `
        <div class="card car-card shadow-hover">
            ${availabilityBadge}
            <img src="${car.image}" class="card-img-top" alt="${car.name}" 
                 onerror="this.src='https://via.placeholder.com/300x200?text=Car+Image'">
            <div class="car-card-body">
                <h5 class="car-title">${car.name}</h5>
                <p class="car-details text-truncate-2">${car.details}</p>
                <div class="rating mb-2">${rating}</div>
                <div class="car-features">${features}</div>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="car-price">
                        ₹${car.price.toLocaleString()}
                        <span class="price-period">/day</span>
                    </div>
                    <button class="btn btn-success" 
                            onclick="openBookingModal(${car.id})"
                            ${!car.available ? 'disabled' : ''}>
                        <i class="fas fa-calendar-plus me-1"></i>
                        ${car.available ? 'Book Now' : 'Unavailable'}
                    </button>
                </div>
            </div>
        </div>
    `;

    return col;
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars + ` <span class="ms-1">(${rating})</span>`;
}

// Filter cars based on selected criteria
function filterCars() {
    const carType = document.getElementById('carType').value;
    const priceRange = document.getElementById('priceRange').value;
    
    // Get checked filters
    const transmissionFilters = getCheckedValues(['automatic', 'manual']);
    const fuelFilters = getCheckedValues(['petrol', 'diesel', 'electric']);
    const seatFilters = getCheckedValues(['seat4', 'seat5', 'seat7']);

    filteredCars = cars.filter(car => {
        // Car type filter
        if (carType && car.type !== carType) return false;
        
        // Price range filter
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(p => parseInt(p) || Infinity);
            if (car.price < min || (max !== Infinity && car.price > max)) return false;
        }
        
        // Transmission filter
        if (transmissionFilters.length > 0 && !transmissionFilters.includes(car.transmission)) return false;
        
        // Fuel filter
        if (fuelFilters.length > 0 && !fuelFilters.includes(car.fuel)) return false;
        
        // Seat filter
        if (seatFilters.length > 0) {
            const seatMatch = seatFilters.some(filter => {
                if (filter === 'seat4' && car.seats <= 4) return true;
                if (filter === 'seat5' && car.seats === 5) return true;
                if (filter === 'seat7' && car.seats >= 7) return true;
                return false;
            });
            if (!seatMatch) return false;
        }
        
        return true;
    });

    loadCars();
}

// Get checked checkbox values
function getCheckedValues(ids) {
    const checkedValues = [];
    ids.forEach(id => {
        if (document.getElementById(id).checked) {
            if (id === 'automatic' || id === 'manual') {
                checkedValues.push(id);
            } else if (id === 'petrol' || id === 'diesel' || id === 'electric') {
                checkedValues.push(id);
            } else if (id.startsWith('seat')) {
                checkedValues.push(id);
            }
        }
    });
    return checkedValues;
}

// Search cars
function searchCars() {
    const location = document.getElementById('searchLocation').value.toLowerCase();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // For now, we'll just filter and show available cars
    // In a real application, this would check availability for specific dates
    filterCars();
    
    if (location || startDate || endDate) {
        // Show search results message
        console.log(`Searching for cars in ${location} from ${startDate} to ${endDate}`);
    }
}

// Change view mode
function viewMode(mode) {
    currentView = mode;
    
    // Update button states
    document.querySelectorAll('[onclick^="viewMode"]').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update grid class
    const carListings = document.getElementById('carListings');
    if (mode === 'list') {
        carListings.classList.add('list-view');
    } else {
        carListings.classList.remove('list-view');
    }
    
    loadCars();
}

// Open booking modal
function openBookingModal(carId) {
    selectedCar = cars.find(car => car.id === carId);
    if (!selectedCar) return;

    // Populate modal with car details
    document.getElementById('modalCarImage').src = selectedCar.image;
    document.getElementById('modalCarName').textContent = selectedCar.name;
    document.getElementById('modalCarDetails').textContent = selectedCar.details;
    document.getElementById('modalCarPrice').textContent = `₹${selectedCar.price.toLocaleString()}/day`;

    // Set default dates
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    document.getElementById('bookingStartDate').value = formatDateTimeLocal(now);
    document.getElementById('bookingEndDate').value = formatDateTimeLocal(tomorrow);
    
    calculateTotal();

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
    modal.show();
}

// Format date for datetime-local input
function formatDateTimeLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Calculate total booking amount
function calculateTotal() {
    if (!selectedCar) return;

    const startDate = new Date(document.getElementById('bookingStartDate').value);
    const endDate = new Date(document.getElementById('bookingEndDate').value);
    
    if (startDate && endDate && endDate > startDate) {
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const total = days * selectedCar.price;
        document.getElementById('totalAmount').textContent = `₹${total.toLocaleString()}`;
    } else {
        document.getElementById('totalAmount').textContent = '₹0';
    }
}

// Confirm booking
function confirmBooking() {
    if (!selectedCar) return;

    const pickupLocation = document.getElementById('pickupLocation').value.trim();
    const startDate = document.getElementById('bookingStartDate').value;
    const endDate = document.getElementById('bookingEndDate').value;

    if (!pickupLocation || !startDate || !endDate) {
        alert('Please fill in all required fields.');
        return;
    }

    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    
    if (endDateTime <= startDateTime) {
        alert('End date must be after start date.');
        return;
    }

    // Calculate total
    const days = Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60 * 24));
    const total = days * selectedCar.price;

    // Create booking object
    const booking = {
        id: Date.now(),
        carId: selectedCar.id,
        carName: selectedCar.name,
        carImage: selectedCar.image,
        userEmail: currentUser.email,
        pickupLocation: pickupLocation,
        startDate: startDate,
        endDate: endDate,
        totalAmount: total,
        status: 'confirmed',
        bookingDate: new Date().toISOString()
    };

    // Add to bookings array
    bookings.push(booking);
    
    // Save to localStorage
    localStorage.setItem('carBookings', JSON.stringify(bookings));

    // Show success message
    alert(`Booking confirmed! \n\nCar: ${selectedCar.name}\nTotal: ₹${total.toLocaleString()}\nBooking ID: ${booking.id}`);

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
    modal.hide();

    // Reset form
    document.getElementById('bookingForm').reset();
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('savedUser');
        localStorage.removeItem('carBookings');
        window.location.href = 'index.html';
    }
}

// Handle image loading errors
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'https://via.placeholder.com/300x200?text=Car+Image';
    }
}, true); 