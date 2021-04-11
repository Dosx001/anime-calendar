from shows import shows
from sys import argv

def main():
    sh = shows()
    sh.html()
    if len(argv) == 1:
        sh.update()
    elif argv[1] == "n":
        sh.rename()
    else:
        sh.updateStreams()

if __name__ == "__main__":
    main()
