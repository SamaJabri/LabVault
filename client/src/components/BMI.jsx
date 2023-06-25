import React from "react";

const BMI = () => {
  return (
    <div className="profile__bmi-info">
      <h3>What is BMI?</h3>
      <p>
        BMI stands for Body Mass Index. It is a measurement that is used to
        assess the body weight relative to height and is commonly used as an
        indicator of whether a person has a healthy body weight or is
        underweight, overweight, or obese.
        <br />
        BMI is calculated by dividing a person's weight in kilograms by the
        square of their height in meters.
        <br />
        It's important to note that BMI is a simple screening tool and does not
        directly measure body fat percentage or body composition. Therefore, it
        may not be accurate for certain individuals, such as athletes with high
        muscle mass or older adults who may have reduced muscle mass.
        <br />
        While BMI is widely used as an initial assessment tool, it is
        recommended to consult with a healthcare professional for a
        comprehensive evaluation of body weight, health, and any associated risk
        factors. They can consider additional factors and measurements to
        provide a more accurate assessment of an individual's overall health and
        weight status.
      </p>

      <h3>What does my BMI result mean?</h3>
      <ul>
        <li>Underweight: BMI less than 18.5</li>
        <li>Normal weight: BMI between 18.5 and 24.9 </li>
        <li>Overweight: BMI between 25 and 29.9 </li>
        <li>Obesity: BMI of 30 or higher</li>
      </ul>
    </div>
  );
};

export default BMI;
