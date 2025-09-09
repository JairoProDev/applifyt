#!/bin/bash

# Applify Setup Script
# This script sets up the development environment for Applify

set -e

echo "🚀 Setting up Applify - La App del Progreso"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    echo "Please update Node.js from: https://nodejs.org/"
    exit 1
fi

print_status "Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "npm $(npm -v) detected"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL is not installed. Please install PostgreSQL 14+ first."
    echo ""
    echo "Installation instructions:"
    echo "• Windows: Download from https://www.postgresql.org/download/windows/"
    echo "• macOS: brew install postgresql@14"
    echo "• Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
    exit 1
fi

print_status "PostgreSQL detected"

# Install dependencies
echo ""
print_info "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_info "Creating .env.local from template..."
    cp env.example .env.local
    
    # Generate a random secret for NextAuth
    NEXTAUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
    
    # Update .env.local with generated secret
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/your-secret-key-here/$NEXTAUTH_SECRET/" .env.local
    else
        # Linux
        sed -i "s/your-secret-key-here/$NEXTAUTH_SECRET/" .env.local
    fi
    
    print_warning "Please edit .env.local with your database credentials"
    print_info "Generated NEXTAUTH_SECRET automatically"
else
    print_status ".env.local already exists"
fi

# Generate Prisma client
echo ""
print_info "Generating Prisma client..."
npx prisma generate

if [ $? -eq 0 ]; then
    print_status "Prisma client generated successfully"
else
    print_error "Failed to generate Prisma client"
    exit 1
fi

# Check if database exists and create if needed
echo ""
print_info "Setting up database..."
DB_NAME="applify"

# Try to connect to PostgreSQL
if psql -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw $DB_NAME; then
    print_status "Database '$DB_NAME' already exists"
else
    print_info "Creating database '$DB_NAME'..."
    
    # Try to create database
    if createdb $DB_NAME 2>/dev/null; then
        print_status "Database created successfully"
    else
        print_warning "Could not create database automatically"
        print_info "Please create the database manually:"
        echo "  psql -U postgres"
        echo "  CREATE DATABASE applify;"
        echo "  \\q"
        echo ""
        print_info "Then update your .env.local with the correct DATABASE_URL"
        echo ""
        read -p "Press Enter to continue after creating the database..."
    fi
fi

# Run database migrations
echo ""
print_info "Running database migrations..."
npx prisma db push

if [ $? -eq 0 ]; then
    print_status "Database migrations completed successfully"
else
    print_error "Failed to run database migrations"
    print_info "Please check your DATABASE_URL in .env.local"
    exit 1
fi

# Optional: Seed database
echo ""
read -p "Do you want to seed the database with sample data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Seeding database with sample data..."
    npm run db:seed
    
    if [ $? -eq 0 ]; then
        print_status "Database seeded successfully"
        print_info "Demo user created: demo@applify.com / demo123"
    else
        print_warning "Failed to seed database (this is optional)"
    fi
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your database credentials if needed"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Useful commands:"
echo "• npm run dev          - Start development server"
echo "• npm run db:studio    - Open Prisma Studio"
echo "• npm run build        - Build for production"
echo ""
echo "Happy coding! 🚀"
