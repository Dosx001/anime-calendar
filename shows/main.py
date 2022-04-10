from shows import Shows


def main():
    shw = Shows(None)
    shw.html()
    shw.update()
    shw.driver.quit()


if __name__ == "__main__":
    main()
