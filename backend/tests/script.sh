#!/bin/bash

# --- Configuration ---
# Set the base URL to your live, deployed Render service
BASE_URL="https://take-ai-campus-3.onrender.com"

# --- Helper function for printing steps ---
print_step() {
    echo ""
    echo "--- $1 ---"
}

# --- Check for jq ---
if ! command -v jq &> /dev/null
then
    echo "Error: jq is not installed. Please install it to run this script."
    echo "On macOS: brew install jq"
    echo "On Debian/Ubuntu: sudo apt-get install jq"
    exit 1
fi


# 1. SIGN UP AND LOG IN
print_step "1. Creating a new user for seeding"
USERNAME="seed_user_$(date +%s)"
PASSWORD="password123"

signup_response=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}" $BASE_URL/auth/signup)
echo "Signup Response: $signup_response"
if [[ "$signup_response" == *"error"* ]]; then
    echo "❌ Signup failed."
    exit 1
fi

print_step "2. Logging in to get auth token"
login_response=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}" $BASE_URL/auth/login)
TOKEN=$(echo $login_response | jq -r .token)

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
    echo "❌ Login failed. Aborting."
    echo "Response: $login_response"
    exit 1
fi
echo "✅ Login successful. Token obtained for user $USERNAME."


# 2. CREATE 30 STUDENT RECORDS IN A LOOP
print_step "3. Seeding database with 30 student records"
for i in {1..30}
do
  # Create slightly different data for each student
  student_name="Test Student $i"
  status="active"
  # Alternate scholarship status
  is_scholarship=$((i % 2 == 0))
  attendance=$((80 + i))
  score=$((75 + i))

  # Send the create request
  create_response=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d "{\"name\": \"$student_name\", \"status\": \"$status\", \"isScholarship\": $is_scholarship, \"attendancePercentage\": $attendance, \"assignmentScore\": $score}" \
  $BASE_URL/api/students)
  
  # Print progress
  echo "  Created student #$i -> Response: $create_response"
  # Sleep for a tiny amount of time to avoid overwhelming the server
  sleep 0.1
done
echo "✅ Seeding complete."


# 3. VERIFY BY READING THE FIRST PAGE OF STUDENTS
print_step "4. Verifying by fetching the first page of students"
# Fetches the first 10 students (the default page size)
read_response=$(curl -s -X GET -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/students")

echo "Response from GET /api/students (first page):"
# Use jq to pretty-print the JSON response
echo $read_response | jq

echo ""
echo "--- Database seeding script finished ---"

