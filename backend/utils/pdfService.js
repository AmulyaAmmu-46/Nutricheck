const PDFDocument = require('pdfkit');

const palette = {
  navy: '#15324b',
  teal: '#0b7a83',
  ink: '#263746',
  muted: '#687988',
  line: '#d9e2e8',
  pale: '#f3f8f9',
  zebra: '#f8fafc',
  low: '#b45309',
  high: '#b91c1c',
  adequate: '#047857'
};

const number = value => Number.isFinite(Number(value)) ? Math.round(Number(value) * 10) / 10 : 0;
const statusColor = status => ({ Low: palette.low, High: palette.high, Adequate: palette.adequate }[status] || palette.muted);
const unitFor = key => key === 'calories' ? ' kcal' : key === 'water' ? ' L' : key.startsWith('vitamin') ? ' mg' : ' g';

const generateMealReportPDF = data => new Promise((resolve, reject) => {
  try {
    const doc = new PDFDocument({ size: 'A4', margin: 48, bufferPages: true });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    const width = doc.page.width - 96;
    const nutrition = data.dailyNutrition || {};
    const comparison = data.comparison || {};
    const profile = data.profile || {};
    const dateLabel = new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const meals = (data.foodItems || []).reduce((groups, item) => {
      const meal = item.mealType || 'Other';
      groups[meal] = groups[meal] || [];
      groups[meal].push(`${item.quantity} ${item.unit} ${item.foodName}`);
      return groups;
    }, {});

    const header = (subtitle, pageNumber) => {
      doc.rect(0, 0, doc.page.width, 86).fill(palette.navy);
      doc.fillColor('#ffffff').fontSize(22).text('NutriCheck', 48, 26);
      doc.fontSize(9).fillColor('#c8e8ea').text(subtitle.toUpperCase(), 48, 57, { characterSpacing: 1 });
      doc.fontSize(8).fillColor(palette.muted).text(`Daily report  |  ${dateLabel}`, 48, 101);
      doc.text(`Page ${pageNumber} of 2`, 445, 101, { width: 100, align: 'right' });
    };
    const footer = () => doc.fontSize(8).fillColor(palette.muted).text('Approximate values for general nutritional guidance. Not a medical diagnosis.', 48, 755, { width, align: 'center' });
    const title = (text, y) => {
      doc.fontSize(15).fillColor(palette.navy).text(text, 48, y);
      doc.moveTo(48, y + 23).lineTo(48 + width, y + 23).strokeColor(palette.teal).lineWidth(1).stroke();
    };
    const card = (x, y, w, label, value, color = palette.navy) => {
      doc.roundedRect(x, y, w, 48, 4).fillAndStroke(palette.pale, palette.line);
      doc.fontSize(8).fillColor(palette.muted).text(label.toUpperCase(), x + 9, y + 9, { width: w - 18 });
      doc.fontSize(13).fillColor(color).text(value, x + 9, y + 24, { width: w - 18 });
    };

    // Page 1: the decision-making summary only.
    header('Daily nutrition assessment', 1);
    doc.fontSize(10).fillColor(palette.ink).text(profile.goal ? `Goal: ${profile.goal}` : 'Personal nutrition summary', 48, 122);
    if (profile.age || profile.gender || profile.activityLevel) doc.text([profile.age && `${profile.age} years`, profile.gender, profile.activityLevel].filter(Boolean).join('  |  '), 270, 122, { width: 278, align: 'right' });
    title('Daily overview', 153);
    const cardWidth = (width - 20) / 3;
    [['Calories', `${number(nutrition.calories)} kcal`, palette.navy], ['Protein', `${number(nutrition.protein)} g`, palette.teal], ['Carbohydrates', `${number(nutrition.carbohydrates)} g`, palette.teal], ['Fats', `${number(nutrition.fats)} g`, palette.navy], ['Fiber', `${number(nutrition.fiber)} g`, palette.teal], ['Water', `${number((nutrition.water || 0) / 1000)} L`, palette.teal]].forEach(([label, value, color], index) => card(48 + (index % 3) * (cardWidth + 10), 190 + Math.floor(index / 3) * 59, cardWidth, label, value, color));

    title('Intake compared with recommendation', 332);
    const columns = [48, 205, 315, 425];
    const tableHeader = y => {
      doc.rect(48, y, width, 24).fill(palette.navy);
      ['Nutrient', 'Daily intake', 'Recommended', 'Status'].forEach((label, index) => doc.fontSize(8.5).fillColor('#ffffff').text(label, columns[index] + 7, y + 8));
    };
    tableHeader(369);
    Object.entries(comparison).slice(0, 14).forEach(([key, value], index) => {
      const y = 393 + index * 22;
      if (index % 2 === 0) doc.rect(48, y, width, 22).fill(palette.zebra);
      const unit = unitFor(key);
      doc.fontSize(8.5).fillColor(palette.ink).text(key.replace('vitamin', 'Vitamin '), columns[0] + 7, y + 7);
      doc.text(`${number(value.intake)}${unit}`, columns[1] + 7, y + 7);
      doc.text(`${number(value.recommended)}${unit}`, columns[2] + 7, y + 7);
      doc.fillColor(statusColor(value.status)).text(value.status, columns[3] + 7, y + 7);
    });
    footer();

    // Page 2: supporting detail, deliberately kept separate from the summary.
    doc.addPage();
    header('Food and nutrient details', 2);
    title('Meal details', 135);
    const mealOrder = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
    mealOrder.forEach((meal, index) => {
      const y = 174 + index * 70;
      doc.roundedRect(48, y, width, 54, 4).fillAndStroke(index % 2 ? palette.zebra : palette.pale, palette.line);
      doc.fontSize(10).fillColor(palette.teal).text(meal, 60, y + 10);
      const text = data.food?.[meal.toLowerCase()] || meals[meal]?.join(', ') || 'No items logged.';
      doc.fontSize(9).fillColor(palette.ink).text(text, 145, y + 10, { width: width - 160, height: 34, ellipsis: true });
    });

    title('Vitamins and minerals', 475);
    const micronutrients = [
      ['Vitamins', nutrition.vitamins, 'mg'],
      ['Minerals', nutrition.minerals, 'mg']
    ];
    micronutrients.forEach(([label, values], groupIndex) => {
      const x = groupIndex === 0 ? 48 : 315;
      doc.fontSize(10).fillColor(palette.teal).text(label, x, 515);
      Object.entries(values || {}).forEach(([key, value], index) => {
        const y = 538 + index * 21;
        doc.fontSize(9).fillColor(palette.ink).text(key, x, y);
        doc.text(`${number(value)} ${label === 'Vitamins' && ['A', 'D'].includes(key) ? 'mcg' : 'mg'}`, x + 130, y, { width: 70, align: 'right' });
        doc.moveTo(x, y + 15).lineTo(x + 205, y + 15).strokeColor(palette.line).lineWidth(0.5).stroke();
      });
    });

    title('Recommended foods', 665);
    const recommendations = data.recommendations || [];
    doc.fontSize(9).fillColor(palette.ink).text(recommendations.length ? recommendations.join('  |  ') : 'No nutrient deficiencies identified in the recorded intake.', 48, 700, { width });
    footer();
    doc.end();
  } catch (error) {
    reject(error);
  }
});

module.exports = { generateMealReportPDF };
