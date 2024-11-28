import tabula

# Read pdf into a list of DataFrame
dfs = tabula.read_pdf("list.pdf", pages='all')

# convert PDF into CSV
tabula.convert_into("list.pdf", "output.csv", output_format="csv", pages='all')