Feature: Poll App
  As a user
  I want to create polls and vote on them
  So that I can gather opinions from others

  Scenario: Create a poll and land on the vote page
    Given I visit the home page
    When I fill in the question "What is your favourite colour?"
    And I fill in option 1 with "Red"
    And I fill in option 2 with "Blue"
    And I submit the poll
    Then I should be on a poll page
    And I should see the question "What is your favourite colour?"
    And I should see the vote form

  Scenario: Vote on a poll
    Given I am on an unvoted poll page
    When I select an option and vote
    Then I should see the results

  Scenario: Cannot vote twice on the same poll
    Given I have already voted on a poll
    Then I should see the results without a vote form

  Scenario: Add and remove options when creating a poll
    Given I visit the home page
    Then I should see 2 option inputs
    When I click "Add option"
    Then I should see 3 option inputs
    When I click the remove button for option 3
    Then I should see 2 option inputs

  Scenario: Creating a poll with an empty question shows an error
    Given I visit the home page
    When I fill in option 1 with "Yes"
    And I fill in option 2 with "No"
    And I submit the poll
    Then the form should not submit
