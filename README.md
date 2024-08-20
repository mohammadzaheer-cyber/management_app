# Inventory Management System

This project is a mobile app designed for managing the inventory of a beauty store. The app allows users to store data locally and includes various features like authentication, product and category management, and a dashboard for tracking statistics.

## Features

1. **User Authentication**
   - New users can register with their name, email, phone number, and password.
   - The registration process includes a confirm password field to ensure correct password entry.
   - Upon successful registration, users can log in to the application.

2. **Dashboard**
   - The dashboard displays the following statistics:
     - Number of categories
     - Number of products
     - Products low in inventory
     - Number of registered users
   - Charts can be used to display these statistics for better visualization.

3. **Category Management**
   - Users can create, edit, and delete categories.
   - Each category will have an image, title, and description.
   - The image can be chosen from the gallery or captured using the device's camera.
   - A cropping tool is included to crop the image to a square aspect ratio.

4. **Product Management**
   - Users can create, edit, and delete products.
   - Each product includes the following details:
     - Primary image
     - A group of additional images
     - Title
     - Description
     - SKU (unique identifier)
     - Category
     - Quantity
     - Weight
     - Dimensions
   - Images can be chosen from the gallery or captured using the device's camera.
   - A cropping tool is included to crop images to a square aspect ratio.

5. **Action History**
   - The application maintains a history of actions performed by each user within the app, allowing for detailed tracking and accountability.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/inventory-management-system.git
   cd inventory-management-system
