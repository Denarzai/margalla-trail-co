// Validation rules for the booking form.
// The function receives the form values and returns an "errors" object.
// A field with a problem gets a message, for example:
//   { phone: 'Enter an 11-digit ...' }
// An empty object {} means the whole form is valid.

export const MAX_NOTE_LENGTH = 200;

export const EMPTY_BOOKING_FORM = {
  fullName: '',
  phone: '',
  email: '',
  youngestAge: '',
  notes: '',
  agreeToTerms: false,
};

export function validateBookingForm(formData) {
  const errors = {};

  // --- Full name: required, at least 3 characters, letters only ---
  const fullName = formData.fullName.trim();
  if (fullName === '') {
    errors.fullName = 'Enter your full name.';
  } else if (fullName.length < 3) {
    errors.fullName = 'Your name must have at least 3 characters.';
  } else if (!/^[A-Za-z .'-]+$/.test(fullName)) {
    errors.fullName = 'Use only letters and spaces in your name.';
  }

  // --- Phone: Pakistani mobile number, 11 digits starting with 03 ---
  // We first remove spaces and dashes so "0300 1234567" is accepted.
  const phoneDigits = formData.phone.replace(/[\s-]/g, '');
  if (phoneDigits === '') {
    errors.phone = 'Enter your mobile number.';
  } else if (!/^03\d{9}$/.test(phoneDigits)) {
    errors.phone = 'Enter an 11-digit mobile number that starts with 03, for example 0300 1234567.';
  }

  // --- Email: must look like name@example.com ---
  const email = formData.email.trim();
  if (email === '') {
    errors.email = 'Enter your email address.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter an email address in the format name@example.com.';
  }

  // --- Age of the youngest participant: whole number from 1 to 90 ---
  const ageText = formData.youngestAge.trim();
  const age = Number(ageText);
  if (ageText === '') {
    errors.youngestAge = 'Enter the age of the youngest participant.';
  } else if (!Number.isInteger(age)) {
    errors.youngestAge = 'Enter the age as a whole number, for example 14.';
  } else if (age < 1 || age > 90) {
    errors.youngestAge = 'Enter an age between 1 and 90.';
  }

  // --- Notes: optional, but not longer than 200 characters ---
  if (formData.notes.length > MAX_NOTE_LENGTH) {
    errors.notes = `Keep your note within ${MAX_NOTE_LENGTH} characters. You have used ${formData.notes.length}.`;
  }

  // --- Confirmation tick ---
  if (!formData.agreeToTerms) {
    errors.agreeToTerms = 'Tick the box to confirm that you understand this is a simulated booking.';
  }

  return errors;
}
