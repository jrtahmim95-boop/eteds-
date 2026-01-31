
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:share_plus/share_plus.dart';

class WeeklyReportScreen extends StatelessWidget {
  const WeeklyReportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D1B2A),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            _buildScoreHero(),
            const SizedBox(height: 24),
            _buildBarChart(),
            const SizedBox(height: 24),
            _buildBadges(),
            const SizedBox(height: 32),
            _buildShareButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildScoreHero() {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(40),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        children: [
          const Text("88%", style: TextStyle(fontSize: 48, fontWeight: FontWeight.black)),
          const Text("Weekly Score", style: TextStyle(color: Colors.white54)),
        ],
      ),
    );
  }

  Widget _buildBarChart() {
    return SizedBox(
      height: 300,
      child: BarChart(
        BarChartData(
          alignment: BarChartAlignment.spaceAround,
          maxY: 10,
          barGroups: [
            BarChartGroupData(x: 0, barRods: [BarChartRodData(toY: 8, color: Colors.blue)]),
            BarChartGroupData(x: 1, barRods: [BarChartRodData(toY: 6, color: Colors.emerald)]),
          ],
          titlesData: const FlTitlesData(show: true),
          gridData: const FlGridData(show: false),
          borderData: FlBorderData(show: false),
        ),
      ),
    );
  }

  Widget _buildBadges() {
    return const Row(
      children: [
        CircleAvatar(child: Icon(Icons.star)),
        SizedBox(width: 12),
        Text("Prayer Champion"),
      ],
    );
  }

  Widget _buildShareButton() {
    return ElevatedButton(
      onPressed: () => Share.share("My Weekly score is 88/100! Tracked with Alo."),
      child: const Text("Share to WhatsApp"),
    );
  }
}
