from shows import Shows


def main():
    shw = Shows()
    shw.html()
    shw.update()
    shw.driver.quit()


if __name__ == "__main__":
    main()
