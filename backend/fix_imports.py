import os
import re

def fix_file(filepath):
    """Fix imports in a file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace AsyncDatabase with AsyncIOMotorDatabase
        content = content.replace(
            'from motor.motor_asyncio import AsyncDatabase',
            'from motor.motor_asyncio import AsyncIOMotorDatabase'
        )
        content = content.replace(
            'from motor.motor_asyncio import AsyncClient, AsyncDatabase',
            'from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase'
        )
        content = content.replace(
            'from motor.motor_asyncio import AsyncClient',
            'from motor.motor_asyncio import AsyncIOMotorClient'
        )
        content = re.sub(r'AsyncDatabase', 'AsyncIOMotorDatabase', content)
        content = re.sub(r'AsyncClient\b(?!IOMotor)', 'AsyncIOMotorClient', content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Fixed: {filepath}")
        return True
    except Exception as e:
        print(f"❌ Error fixing {filepath}: {e}")
        return False

def fix_all_imports():
    """Fix imports in all Python files"""
    fixed_count = 0
    
    # Directories to scan
    directories = ['app', 'scripts']
    
    for directory in directories:
        for root, dirs, files in os.walk(directory):
            for file in files:
                if file.endswith('.py'):
                    filepath = os.path.join(root, file)
                    if fix_file(filepath):
                        fixed_count += 1
    
    print(f"\n✅ Fixed {fixed_count} files!")

if __name__ == "__main__":
    print("🔧 Fixing Motor imports...\n")
    fix_all_imports()
