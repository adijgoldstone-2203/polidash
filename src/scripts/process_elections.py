import os
import csv
import json

workspace = "/Users/adigoldstone/Desktop/AG Projects"
output_file = os.path.join(workspace, "src/data/elections_summary.json")

# Make sure src/data exists
os.makedirs(os.path.dirname(output_file), exist_ok=True)

# Slip to Party Key mappings
PARTY_MAPPINGS = {
    "25": {
        "מחל": "Likud",
        "פה": "Yesh Atid",
        "שס": "Shas",
        "כן": "National Unity",
        "ט": "Religious Zionism",
        "ג": "United Torah Judaism",
        "ל": "Yisrael Beiteinu",
        "ום": "Hadash-Ta'al",
        "עם": "Ra'am",
        "אמת": "Labor",
        "מרצ": "Meretz",
        "ד": "Balad",
        "ב": "Jewish Home"
    },
    "24": {
        "מחל": "Likud",
        "פה": "Yesh Atid",
        "שס": "Shas",
        "כן": "Blue & White",
        "ב": "Yamina",
        "אמת": "Labor",
        "ג": "United Torah Judaism",
        "ל": "Yisrael Beiteinu",
        "ט": "Religious Zionism",
        "ודעם": "Joint List",
        "ת": "New Hope",
        "מרצ": "Meretz",
        "עם": "Ra'am"
    },
    "23": {
        "מחל": "Likud",
        "פה": "Blue & White",
        "ודעם": "Joint List",
        "שס": "Shas",
        "אמת": "Labor-Gesher-Meretz",
        "ג": "United Torah Judaism",
        "טב": "Yamina",
        "ל": "Yisrael Beiteinu"
    },
    "22": {
        "פה": "Blue & White",
        "מחל": "Likud",
        "ודעם": "Joint List",
        "שס": "Shas",
        "ל": "Yisrael Beiteinu",
        "ג": "United Torah Judaism",
        "טב": "Yamina",
        "אמת": "Labor-Gesher",
        "מרצ": "Democratic Union"
    }
}

files_config = {
    "25": {"file": "-25-.csv", "encoding": "utf-8"},
    "24": {"file": "-24-.csv", "encoding": "windows-1255"},
    "23": {"file": "-23-.csv", "encoding": "windows-1255"},
    "22": {"file": "-22-.csv", "encoding": "windows-1255"}
}

summary_data = {}

for knesset, cfg in files_config.items():
    file_path = os.path.join(workspace, cfg["file"])
    if not os.path.exists(file_path):
        print(f"Warning: File {cfg['file']} not found. Skipping Knesset {knesset}.")
        continue

    print(f"Processing Knesset {knesset} ({cfg['file']})...")
    
    national_voters = 0
    national_bzb = 0
    national_invalid = 0
    national_valid = 0
    national_parties = {}
    
    towns = {}
    
    mapping = PARTY_MAPPINGS[knesset]
    
    with open(file_path, mode='r', encoding=cfg["encoding"]) as f:
        # Some government files have BOM or leading white spaces, strip them
        reader = csv.reader(f)
        headers = next(reader)
        # Clean headers
        headers = [h.strip().replace('\ufeff', '') for h in headers]
        
        # Verify columns
        # Index mappings
        name_idx = headers.index("שם ישוב")
        code_idx = headers.index("סמל ישוב")
        bzb_idx = headers.index("בזב")
        voters_idx = headers.index("מצביעים")
        invalid_idx = headers.index("פסולים")
        valid_idx = headers.index("כשרים")
        
        # Parties are everything else after index 6 (or whatever is not the metadata columns)
        metadata_cols = {"סמל ועדה", "שם ישוב", "סמל ישוב", "בזב", "מצביעים", "פסולים", "כשרים"}
        party_cols = [h for h in headers if h not in metadata_cols]
        
        for row in reader:
            if not row or len(row) < len(headers):
                continue
            
            # Clean cells
            row = [cell.strip() for cell in row]
            
            # Extract basic data
            town_name = row[name_idx]
            
            # Skip totals or headers
            if "סה" in town_name or "סה\"כ" in town_name or "כללי" in town_name:
                continue
                
            try:
                town_code = int(row[code_idx])
            except ValueError:
                # If code is not an int, it's not a locality row
                continue
                
            if town_code == 0:
                continue
                
            try:
                bzb = int(row[bzb_idx])
                voters = int(row[voters_idx])
                invalid = int(row[invalid_idx])
                valid = int(row[valid_idx])
            except ValueError:
                # If values are not ints, skip
                continue

            # Update national counts
            national_bzb += bzb
            national_voters += voters
            national_invalid += invalid
            national_valid += valid
            
            town_parties = {}
            
            for p_col in party_cols:
                p_idx = headers.index(p_col)
                try:
                    votes = int(row[p_idx])
                except ValueError:
                    votes = 0
                
                # Determine standard key
                p_key = mapping.get(p_col, "Other")
                
                # Add to town votes
                town_parties[p_key] = town_parties.get(p_key, 0) + votes
                
                # Add to national votes
                national_parties[p_key] = national_parties.get(p_key, 0) + votes

            # Determine winning party for this town
            winning_party = "Other"
            max_votes = -1
            for p_key, p_votes in town_parties.items():
                if p_key != "Other" and p_votes > max_votes:
                    max_votes = p_votes
                    winning_party = p_key
            # If no party votes, winning is Other
            if max_votes <= 0:
                # Check Other votes
                if town_parties.get("Other", 0) > 0:
                    winning_party = "Other"
            
            # Calculate percentages for the town
            town_percents = {}
            if valid > 0:
                for p_key, p_votes in town_parties.items():
                    if p_votes > 0:
                        town_percents[p_key] = round((p_votes / valid) * 100, 2)
            
            towns[str(town_code)] = {
                "name": town_name,
                "bzb": bzb,
                "voters": voters,
                "valid": valid,
                "turnout": round((voters / bzb * 100) if bzb > 0 else 0, 2),
                "winner": winning_party,
                "results": town_percents
            }

    # Calculate national percentages
    national_percents = {}
    if national_valid > 0:
        for p_key, p_votes in national_parties.items():
            if p_votes > 0:
                national_percents[p_key] = round((p_votes / national_valid) * 100, 2)
                
    summary_data[knesset] = {
        "knesset": knesset,
        "bzb": national_bzb,
        "voters": national_voters,
        "valid": national_valid,
        "turnout": round((national_voters / national_bzb * 100) if national_bzb > 0 else 0, 2),
        "results": national_percents,
        "towns": towns
    }
    
    print(f"Knesset {knesset} processed successfully! Localities count: {len(towns)}")

# Write to file
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(summary_data, f, ensure_ascii=False, indent=2)

print(f"All done! Summary output saved to: {output_file}")
