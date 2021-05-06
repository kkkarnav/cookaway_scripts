import os
import unittest
from selenium import webdriver
import time


# class to handle loading and lag time measurements
class Timer:

    def __init__(self):
        self._start_time = None

    def start(self):
        self._start_time = time.perf_counter()

    def stop(self):
        elapsed_time = time.perf_counter() - self._start_time
        self._start_time = None
        return elapsed_time


# page test case
class JoinCookalongTestCase(unittest.TestCase):

    def setUp(self):
        # os.environ['MOZ_HEADLESS'] = "1"  # test runs in the background
        self.test_timer = Timer()

        # uses firefox as the browser
        self.driver = webdriver.Firefox(executable_path=r"geckodriver.exe")
        self.driver.maximize_window()

        self.test_timer.start()

        # sanity check to load the page and confirm
        self.driver.get('https://thecookaway.com/cookalong-live')
        print("Testing: ", self.driver.title)
        print("========================================")

        print(f"Page Time To Interactive (TTI): {self.test_timer.stop():0.4f} seconds")
        print("========================================")

    def test_Button(self):

        # grab the first button on the page
        button = self.driver.find_element_by_tag_name("button")

        # check if the button is valid and visible
        is_interactive = (button.is_enabled() and button.is_displayed())

        # simulate clicking the button to check if it's live
        is_clickable = self.click_button(button)

        self.assertTrue((is_interactive and is_clickable), f"Button at {button.location} is not interactive.")

    # click a button and return whether it worked
    def click_button(self, button):
        success = False
        try:
            button.click()
            print(f"Button at {button.location} is interactive.")
            success = True

        except Exception:
            pass

        finally:
            self.driver.back()
            time.sleep(5)
            return success

    def tearDown(self):
        self.driver.close()


if __name__ == "__main__":
    unittest.main()
