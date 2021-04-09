from shows import shows
from sys import argv

def main():
    sh = shows()
    sh.html()
    if len(argv) == 1:
        sh.update()
    else:
        sh.rebase()

if __name__ == "__main__":
    main()
