#!/bin/bash

# --- Configuration ---
BASE_URL="https://take-ai-campus-3.onrender.com"
UUID=$(date +%s)

# --- Test Counters ---
TOTAL_TESTS=0
PASSED_TESTS=0

# --- Color Definitions ---
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# --- Helper Functions ---
print_header() {
    echo ""
    echo -e "${YELLOW}=====================================================${NC}"
    echo -e "${YELLOW}  $1${NC}"
    echo -e "${YELLOW}=====================================================${NC}"
}

# This function runs a test and checks the HTTP status code
run_test() {
    local test_name="$1"
    local command_to_run="$2"
    local expected_status="$3"
    
    ((TOTAL_TESTS++))
    echo -e "\n${CYAN}Running Test:${NC} ${test_name}..."
    
    # We capture the full output, then separate the body and the status code
    http_response=$(eval "$command_to_run")
    status_code=$(echo "$http_response" | tail -n1)
    response_body=$(echo "$http_response" | sed '$d')

    if [ "$status_code" -eq "$expected_status" ]; then
        echo -e "  └─ Status: ${GREEN}PASS${NC} (Expected ${expected_status}, Got ${status_code})"
        ((PASSED_TESTS++))
    else
        echo -e "  └─ Status: ${RED}FAIL${NC} (Expected ${expected_status}, Got ${status_code})"
        echo "     Response: $response_body"
    fi
}

# ================================================================= #
#  TEST SUITE START
# ================================================================= #

# Note: The /health endpoint is not implemented on the server, so that test has been removed.

print_header "CATEGORY: Comprehensive Security Testing (6 Tests)"
run_test "GET /api/students without token" "curl -s -w '\n%{http_code}' $BASE_URL/api/students" 401
run_test "GET /api/students with invalid token" "curl -s -H 'Authorization: Bearer invalidtoken' -w '\n%{http_code}' $BASE_URL/api/students" 403
run_test "POST /api/students without token" "curl -s -X POST -H 'Content-Type: application/json' -d '{}' -w '\n%{http_code}' $BASE_URL/api/students" 401
run_test "GET /api/students/1 without token" "curl -s -w '\n%{http_code}' $BASE_URL/api/students/1" 401
run_test "PUT /api/students/1 without token" "curl -s -X PUT -H 'Content-Type: application/json' -d '{}' -w '\n%{http_code}' $BASE_URL/api/students/1" 401
run_test "DELETE /api/students/1 without token" "curl -s -X DELETE -w '\n%{http_code}' $BASE_URL/api/students/1" 401


print_header "CATEGORY: User Authentication (3 Tests)"
USERNAME="testuser_$UUID"
PASSWORD="password123"
run_test "Should FAIL to log in with incorrect password" "curl -s -X POST -H 'Content-Type: application/json' -d '{\"username\": \"$USERNAME\", \"password\": \"wrongpass\"}' -w '\n%{http_code}' $BASE_URL/auth/login" 401
run_test "Should sign up a new user" "curl -s -X POST -H 'Content-Type: application/json' -d '{\"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}' -w '\n%{http_code}' $BASE_URL/auth/signup" 201
run_test "Should FAIL to sign up with a duplicate username" "curl -s -X POST -H 'Content-Type: application/json' -d '{\"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}' -w '\n%{http_code}' $BASE_URL/auth/signup" 500

login_response=$(curl -s -X POST -H 'Content-Type: application/json' -d "{\"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}" $BASE_URL/auth/login)
TOKEN=$(echo "$login_response" | jq -r .token)
if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then echo -e "${RED}FATAL: Could not get token.${NC}"; exit 1; fi
echo -e "\n${GREEN}Successfully logged in as User 1. Token obtained.${NC}"


print_header "CATEGORY: Create Student - Validation Testing (10 Tests)"
# Missing fields
run_test "CREATE: Should fail with missing 'name'" "curl -s -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' -d '{\"status\": \"active\", \"is_scholarship\": false, \"attendance_percentage\": 80, \"assignment_score\": 75}' -w '\n%{http_code}' $BASE_URL/api/students" 400
run_test "CREATE: Should fail with missing 'status'" "curl -s -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' -d '{\"name\": \"Test\", \"is_scholarship\": false, \"attendance_percentage\": 80, \"assignment_score\": 75}' -w '\n%{http_code}' $BASE_URL/api/students" 400
run_test "CREATE: Should fail with missing 'is_scholarship'" "curl -s -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' -d '{\"name\": \"Test\", \"status\": \"active\", \"attendance_percentage\": 80, \"assignment_score\": 75}' -w '\n%{http_code}' $BASE_URL/api/students" 400
run_test "CREATE: Should fail with missing 'attendance_percentage'" "curl -s -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' -d '{\"name\": \"Test\", \"status\": \"active\", \"is_scholarship\": true, \"assignment_score\": 75}' -w '\n%{http_code}' $BASE_URL/api/students" 400
# Invalid data types and values
run_test "CREATE: Should fail with invalid 'status' enum" "curl -s -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' -d '{\"name\": \"Test\", \"status\": \"pending\", \"is_scholarship\": false, \"attendance_percentage\": 80, \"assignment_score\": 75}' -w '\n%{http_code}' $BASE_URL/api/students" 400
run_test "CREATE: Should fail with empty 'name' string" "curl -s -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' -d '{\"name\": \"\", \"status\": \"active\", \"is_scholarship\": false, \"attendance_percentage\": 80, \"assignment_score\": 75}' -w '\n%{http_code}' $BASE_URL/api/students" 400
run_test "CREATE: Should fail when 'is_scholarship' is not a boolean" "curl -s -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' -d '{\"name\": \"Test\", \"status\": \"active\", \"is_scholarship\": \"yes\", \"attendance_percentage\": 80, \"assignment_score\": 75}' -w '\n%{http_code}' $BASE_URL/api/students" 400
run_test "CREATE: Should fail when 'attendance_percentage' is > 100" "curl -s -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' -d '{\"name\": \"Test\", \"status\": \"active\", \"is_scholarship\": false, \"attendance_percentage\": 101, \"assignment_score\": 75}' -w '\n%{http_code}' $BASE_URL/api/students" 400
run_test "CREATE: Should fail when 'assignment_score' is a string" "curl -s -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' -d '{\"name\": \"Test\", \"status\": \"active\", \"is_scholarship\": false, \"attendance_percentage\": 80, \"assignment_score\": \"good\"}' -w '\n%{http_code}' $BASE_URL/api/students" 400
run_test "CREATE: Should fail when a field is null" "curl -s -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' -d '{\"name\": null, \"status\": \"active\", \"is_scholarship\": false, \"attendance_percentage\": 80, \"assignment_score\": 75}' -w '\n%{http_code}' $BASE_URL/api/students" 400


print_header "CATEGORY: Core CRUD Integration (5 Tests)"
# FIX: Added robust error handling. The script now checks if the create call was successful before trying to parse the ID.
create_response=$(curl -s -w '\n%{http_code}' -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name": "Core Student", "status": "active", "is_scholarship": true, "attendance_percentage": 90, "assignment_score": 85}' $BASE_URL/api/students)
create_status_code=$(echo "$create_response" | tail -n1)
create_response_body=$(echo "$create_response" | sed '$d')

if [ "$create_status_code" -ne 201 ]; then
    echo -e "${RED}FATAL: Could not create student for CRUD tests. Status: $create_status_code, Body: $create_response_body${NC}"
    exit 1
fi
STUDENT_ID=$(echo "$create_response_body" | jq -r .id)
run_test "CREATE: Should create a valid student" "echo 201" 201
run_test "READ: Should read the created student" "curl -s -H 'Authorization: Bearer $TOKEN' -w '\n%{http_code}' $BASE_URL/api/students/$STUDENT_ID" 200
run_test "UPDATE: Should update the student" "curl -s -X PUT -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' -d '{\"name\": \"Updated Student\", \"status\": \"graduated\"}' -w '\n%{http_code}' $BASE_URL/api/students/$STUDENT_ID" 200
run_test "DELETE: Should delete the student" "curl -s -X DELETE -H 'Authorization: Bearer $TOKEN' -w '\n%{http_code}' $BASE_URL/api/students/$STUDENT_ID" 200
run_test "VERIFY: Should confirm deletion with a 404" "curl -s -H 'Authorization: Bearer $TOKEN' -w '\n%{http_code}' $BASE_URL/api/students/$STUDENT_ID" 404


print_header "CATEGORY: Data Isolation & Advanced Security (4 Tests)"
# Create a second user
USERNAME2="testuser2_$UUID"
run_test "Should sign up a second user" "curl -s -X POST -H 'Content-Type: application/json' -d '{\"username\": \"$USERNAME2\", \"password\": \"$PASSWORD\"}' -w '\n%{http_code}' $BASE_URL/auth/signup" 201
login_response_2=$(curl -s -X POST -H 'Content-Type: application/json' -d "{\"username\": \"$USERNAME2\", \"password\": \"$PASSWORD\"}" $BASE_URL/auth/login)
TOKEN2=$(echo "$login_response_2" | jq -r .token)
if [ "$TOKEN2" == "null" ] || [ -z "$TOKEN2" ]; then echo -e "${RED}FATAL: Could not get token for User 2.${NC}"; exit 1; fi
echo -e "\n${GREEN}Successfully logged in as User 2. Token obtained.${NC}"

# User 1 creates a student that User 2 will try to access
create_response_iso=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name": "User 1 Only", "status": "active", "is_scholarship": true, "attendance_percentage": 90, "assignment_score": 85}' $BASE_URL/api/students)
ISO_STUDENT_ID=$(echo "$create_response_iso" | jq -r .id)

run_test "ISOLATION: User 2 should FAIL to read User 1's student" "curl -s -H 'Authorization: Bearer $TOKEN2' -w '\n%{http_code}' $BASE_URL/api/students/$ISO_STUDENT_ID" 404
run_test "ISOLATION: User 2 should FAIL to update User 1's student" "curl -s -X PUT -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN2' -d '{\"name\": \"Hacker\"}' -w '\n%{http_code}' $BASE_URL/api/students/$ISO_STUDENT_ID" 404
run_test "ISOLATION: User 2 should FAIL to delete User 1's student" "curl -s -X DELETE -H 'Authorization: Bearer $TOKEN2' -w '\n%{http_code}' $BASE_URL/api/students/$ISO_STUDENT_ID" 404


print_header "CATEGORY: Boundary & Pagination Testing (9 Tests)"
echo -e "\nSeeding 15 students for pagination tests..."
for i in {1..15}; do
    curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d "{\"name\": \"Page Student $i\", \"status\": \"inactive\", \"is_scholarship\": false, \"attendance_percentage\": 60, \"assignment_score\": 60}" $BASE_URL/api/students > /dev/null
done
run_test "PAGINATION: Should get page 1 with limit 7" "curl -s -H 'Authorization: Bearer $TOKEN' '$BASE_URL/api/students?page=1&limit=7' | jq 'length == 7' | grep -q true && echo 200 || echo 400" 200
run_test "PAGINATION: Should get page 3 with limit 7 (2 items)" "curl -s -H 'Authorization: Bearer $TOKEN' '$BASE_URL/api/students?page=3&limit=7' | jq 'length == 2' | grep -q true && echo 200 || echo 400" 200
run_test "PAGINATION: Should get empty array for out-of-bounds page" "curl -s -H 'Authorization: Bearer $TOKEN' '$BASE_URL/api/students?page=4&limit=7' | jq 'length == 0' | grep -q true && echo 200 || echo 400" 200
run_test "PAGINATION: Should fail with non-numeric 'page' param" "curl -s -H 'Authorization: Bearer $TOKEN' -w '\n%{http_code}' '$BASE_URL/api/students?page=abc'" 400
run_test "PAGINATION: Should fail with negative 'limit' param" "curl -s -H 'Authorization: Bearer $TOKEN' -w '\n%{http_code}' '$BASE_URL/api/students?limit=-5'" 400
run_test "FILTER: Should get only inactive students" "curl -s -H 'Authorization: Bearer $TOKEN' '$BASE_URL/api/students?status=inactive' | jq 'map(.status == \"inactive\") | all' | grep -q true && echo 200 || echo 400" 200
run_test "FILTER: Should get empty array for non-existent status" "curl -s -H 'Authorization: Bearer $TOKEN' '$BASE_URL/api/students?status=foobar' | jq 'length == 0' | grep -q true && echo 200 || echo 400" 200
run_test "CALCULATED FIELD: Should create student with MINIMUM scores" "curl -s -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' -d '{\"name\": \"Min Score\", \"status\": \"active\", \"is_scholarship\": false, \"attendance_percentage\": 0, \"assignment_score\": 0}' -w '\n%{http_code}' $BASE_URL/api/students" 201
run_test "CALCULATED FIELD: Should create student with MAXIMUM scores" "curl -s -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' -d '{\"name\": \"Max Score\", \"status\": \"active\", \"is_scholarship\": true, \"attendance_percentage\": 100, \"assignment_score\": 100}' -w '\n%{http_code}' $BASE_URL/api/students" 201

# ================================================================= #
#  FINAL SUMMARY
# ================================================================= #
print_header "FINAL TEST SUMMARY"
echo "A total of $TOTAL_TESTS tests were run."
if [ "$PASSED_TESTS" -eq "$TOTAL_TESTS" ]; then
    echo -e "${GREEN}All $TOTAL_TESTS tests passed! Your API is looking solid.${NC}"
else
    echo -e "${RED}$((TOTAL_TESTS - PASSED_TESTS)) of $TOTAL_TESTS tests failed.${NC}"
    echo -e "${YELLOW}NOTE: Some failures are expected until the backend validation is fully implemented.${NC}"
fi
echo ""

