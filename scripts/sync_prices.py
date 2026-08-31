import urllib.request
import json
import os
import re

API_URL = "https://hamadh.net/api/v2?api_key=PLUS-679781bd532e6ec3b5759a12&action=services"

print("1. Fetching latest service rates from provider API...")
try:
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    req = urllib.request.Request(API_URL, headers=headers)
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        
        services_list = data.get('services', [])
        live_prices = {}
        for item in services_list:
            try:
                s_id = int(item.get('service_id'))
                price = float(item.get('price_per_1000_usd', 0))
                live_prices[s_id] = price
            except (ValueError, TypeError):
                continue
        
        print(f"   Successfully retrieved {len(live_prices)} live service prices from provider.")

        # Read current js/services-data.js
        target_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'js', 'services-data.js')
        with open(target_path, 'r', encoding='utf-8') as f:
            js_content = f.read()

        json_match = re.search(r'(?:const|var|let|window\.)\s*SERVICES_DATA\s*=\s*(\[[\s\S]*\]);?', js_content)
        if not json_match:
            print("   [ERROR] Could not parse SERVICES_DATA in services-data.js")
            exit(1)

        services = json.loads(json_match.group(1))
        updated_count = 0

        for s in services:
            s_id = s.get('id')
            if s_id in live_prices:
                new_price = round(live_prices[s_id], 4)
                old_price = s.get('base_price_1k')
                if old_price != new_price:
                    print(f"   - Service #{s_id} ({s.get('name')[:30]}...): ${old_price} -> ${new_price}")
                    s['base_price_1k'] = new_price
                    updated_count += 1

        if updated_count > 0:
            new_js_content = f"/**\n * KD Store - Full Curated Services Database\n * Auto-synced from provider API\n */\n\nconst SERVICES_DATA = {json.dumps(services, ensure_ascii=False, indent=2)};\n"
            with open(target_path, 'w', encoding='utf-8') as f:
                f.write(new_js_content)
            print(f"2. Successfully updated {updated_count} prices in js/services-data.js!")
        else:
            print("2. All prices are currently up to date with provider rates!")

except Exception as e:
    print(f"   [ERROR] Price sync failed: {str(e)}")
    exit(1)
