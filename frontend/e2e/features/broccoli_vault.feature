Feature: Broccoli Vault
  As a curious user
  I want to read interesting facts about broccoli
  So that I can expand my knowledge of the world's greatest vegetable

  Scenario: A broccoli fact is displayed on page load
    Given I visit the Broccoli Vault
    Then I should see a broccoli fact

  Scenario: I can fetch a new fact
    Given I visit the Broccoli Vault
    And a broccoli fact is displayed
    When I click "Give me another one"
    Then I should see a different broccoli fact

  Scenario: An error message is shown when the API is unavailable
    Given the broccoli API is unavailable
    When I visit the Broccoli Vault
    Then I should see an error message
