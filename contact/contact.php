<?php

$errors = array();
$data = array();

// validate the variables
if (empty($_POST['name']))
	$errors['name'] = 'Name is required.';
if (empty($_POST['email']))
	$errors['email'] = 'Email is required.';
if (empty($_POST['message']))
	$errors['message'] = 'Message is required.';

// Return a response and send the notification email if everything is valid.
if ( ! empty($errors)) {

  // If there are items in our errors array, return those errors.
  $data['success'] = false;
  $data['errors'] = $errors;
  $data['messageError'] = 'Please check the fields in red.';
  
} else {

  // If there are no errors, return a message.
  $data['success'] = true;
  $data['messageSuccess'] = 'Thanks. Your message was submitted successfully.';
  
  // CHANGE THE TWO LINES BELOW
  $email_to = "paul4nandez@gmail.com";
  $email_subject = "Sounds Right Here Contact Form Message";
  
  $name = $_POST['name']; // required
  $email_from = $_POST['email']; // required
  $message = $_POST['message']; // required
  
  $email_message = "Form details below" . "\n\n";
  $email_message .= "Name: " . $name . "\n";
  $email_message .= "Email: " . $email_from . "\n";
  $email_message .= "Message: " . $message . "\n";
  
  $headers = 'From: ' . $email_from . "\r\n" .
  	'Reply-To: ' . $email_from . "\r\n" .
  	'X-Mailer: PHP/' . phpversion();
  
  @mail($email_to, $email_subject, $email_message, $headers);
}

// Return all our data to an AJAX call.
echo json_encode($data);

