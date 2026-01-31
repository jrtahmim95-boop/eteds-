
import 'package:flutter/material.dart';
import 'package:local_auth/local_auth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class VaultScreen extends StatefulWidget {
  const VaultScreen({super.key});

  @override
  State<VaultScreen> createState() => _VaultScreenState();
}

class _VaultScreenState extends State<VaultScreen> {
  final LocalAuthentication _auth = LocalAuthentication();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  bool _isAuthenticated = false;

  Future<void> _authenticate() async {
    try {
      final bool didAuthenticate = await _auth.authenticate(
        localizedReason: 'Please authenticate to unlock your secure vault',
        options: const AuthenticationOptions(biometricOnly: true),
      );
      if (didAuthenticate) {
        setState(() => _isAuthenticated = true);
      }
    } catch (e) {
      debugPrint("Authentication error: $e");
    }
  }

  Future<void> _savePassword(String key, String value) async {
    // Encrypted automatically using AES-256 on iOS and KeyStore on Android
    await _storage.write(key: key, value: value);
  }

  @override
  Widget build(BuildContext context) {
    if (!_isAuthenticated) {
      return Scaffold(
        backgroundColor: const Color(0xFF0D1B2A),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.lock_outline, size: 80, color: Colors.blue),
              const SizedBox(height: 24),
              const Text("Vault Locked", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              const SizedBox(height: 48),
              ElevatedButton(
                onPressed: _authenticate,
                child: const Text("Unlock with Biometrics"),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFF0D1B2A),
      appBar: AppBar(title: const Text("Secure Vault")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // List of secure items...
        ],
      ),
    );
  }
}
