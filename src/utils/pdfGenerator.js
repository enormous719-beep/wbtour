import jsPDF from 'jspdf'
import 'jspdf-autotable'
import logoImage from '@/assets/wbtour.png'

// Helper function to clean and parse itinerary text
function parseItineraryText(text) {
    // Remove leading * and trim
    return text.replace(/^\*\s*/, '').trim()
}

// Helper function to load image as base64
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}

export async function generateItineraryPDF(packageData) {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let yPos = 20

    // Load logo
    let logo = null
    try {
        logo = await loadImage(logoImage)
    } catch (error) {
        console.warn('Logo failed to load:', error)
    }

    // Helper function to check page overflow
    const checkPageOverflow = (additionalHeight = 10) => {
        if (yPos + additionalHeight > pageHeight - 30) {
            doc.addPage()
            yPos = 20
            return true
        }
        return false
    }

    // ====== HEADER - Brand with colored background ======
    doc.setFillColor(16, 185, 129)
    doc.rect(0, 0, pageWidth, 35, 'F')

    // Add logo if loaded
    if (logo) {
        try {
            // Logo size: width 25, height auto-calculated to maintain aspect ratio
            const logoWidth = 25
            const logoHeight = (logo.height / logo.width) * logoWidth
            const logoY = 10 // Center vertically in 35px header
            doc.addImage(logo, 'PNG', margin, logoY, logoWidth, logoHeight)

            // Text next to logo
            doc.setFontSize(18)
            doc.setTextColor(255, 255, 255)
            doc.setFont(undefined, 'bold')
            doc.text('Wahyu Bandung Tour', margin + logoWidth + 8, 18)

            doc.setFontSize(9)
            doc.setFont(undefined, 'normal')
            doc.text('Your Travel Partner', margin + logoWidth + 8, 24)
        } catch (error) {
            console.warn('Error adding logo to PDF:', error)
            // Fallback to text
            doc.setFontSize(26)
            doc.setTextColor(255, 255, 255)
            doc.setFont(undefined, 'bold')
            doc.text('WBTour', margin, 18)

            doc.setFontSize(10)
            doc.setFont(undefined, 'normal')
            doc.text('Wahyu Bandung Tour - Your Travel Partner', margin, 26)
        }
    } else {
        // Fallback to text if logo didn't load
        doc.setFontSize(26)
        doc.setTextColor(255, 255, 255)
        doc.setFont(undefined, 'bold')
        doc.text('WBTour', margin, 18)

        doc.setFontSize(10)
        doc.setFont(undefined, 'normal')
        doc.text('Wahyu Bandung Tour - Your Travel Partner', margin, 26)
    }

    yPos = 50

    // ====== Package Title ======
    doc.setFontSize(20)
    doc.setTextColor(16, 185, 129)
    doc.setFont(undefined, 'bold')
    const titleLines = doc.splitTextToSize(packageData.title, pageWidth - margin * 2)
    titleLines.forEach(line => {
        doc.text(line, margin, yPos)
        yPos += 7
    })
    yPos += 3

    // Duration & City
    doc.setFontSize(11)
    doc.setTextColor(80, 80, 80)
    doc.setFont(undefined, 'normal')
    doc.text(`Destinasi: ${packageData.city} | Durasi: ${packageData.days} Hari ${packageData.nights} Malam`, margin, yPos)

    doc.setDrawColor(16, 185, 129)
    doc.setLineWidth(0.5)
    doc.line(margin, yPos + 3, pageWidth - margin, yPos + 3)
    yPos += 15

    // ====== Highlights Section ======
    if (packageData.highlights && packageData.highlights.length > 0) {
        checkPageOverflow(20)

        doc.setFontSize(14)
        doc.setTextColor(0, 0, 0)
        doc.setFont(undefined, 'bold')
        doc.text('Highlights', margin, yPos)
        yPos += 5

        // Highlights table
        const highlightRows = packageData.highlights.map((h, i) => [
            (i + 1).toString(),
            parseItineraryText(h)
        ])

        doc.autoTable({
            startY: yPos,
            head: [['No', 'Highlight']],
            body: highlightRows,
            theme: 'grid',
            headStyles: {
                fillColor: [16, 185, 129],
                textColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: 'bold',
                halign: 'left'
            },
            columnStyles: {
                0: { cellWidth: 12, halign: 'center' },
                1: { cellWidth: 'auto' }
            },
            bodyStyles: {
                fontSize: 9,
                textColor: [60, 60, 60]
            },
            margin: { left: margin, right: margin },
            styles: {
                lineColor: [200, 200, 200],
                lineWidth: 0.1
            }
        })

        yPos = doc.lastAutoTable.finalY + 10
    }

    // ====== Itinerary Section ======
    if (packageData.itinerary && packageData.itinerary.length > 0) {
        checkPageOverflow(20)

        doc.setFontSize(14)
        doc.setTextColor(0, 0, 0)
        doc.setFont(undefined, 'bold')
        doc.text('Itinerary Lengkap', margin, yPos)
        yPos += 5

        packageData.itinerary.forEach((dayActivities, dayIndex) => {
            // Prepare activities for this day
            const dayRows = Array.isArray(dayActivities)
                ? dayActivities.map((activity, i) => [
                    (i + 1).toString(),
                    parseItineraryText(activity)
                ])
                : []

            if (dayRows.length === 0) return

            // Day table
            doc.autoTable({
                startY: yPos,
                head: [[{ content: `Day ${dayIndex + 1}`, colSpan: 2, styles: { halign: 'left', fillColor: [240, 253, 244], textColor: [16, 185, 129], fontStyle: 'bold' } }]],
                body: dayRows,
                theme: 'grid',
                headStyles: {
                    fontSize: 11,
                    fontStyle: 'bold'
                },
                columnStyles: {
                    0: { cellWidth: 12, halign: 'center' },
                    1: { cellWidth: 'auto' }
                },
                bodyStyles: {
                    fontSize: 9,
                    textColor: [60, 60, 60]
                },
                margin: { left: margin, right: margin },
                styles: {
                    lineColor: [200, 200, 200],
                    lineWidth: 0.1
                }
            })

            yPos = doc.lastAutoTable.finalY + 6
        })
        yPos += 5
    }

    // ====== Include/Exclude Section ======
    if ((packageData.includes && packageData.includes.length > 0) ||
        (packageData.excludes && packageData.excludes.length > 0)) {

        checkPageOverflow(30)

        // Section divider
        doc.setDrawColor(200, 200, 200)
        doc.setLineWidth(0.3)
        doc.line(margin, yPos, pageWidth - margin, yPos)
        yPos += 10

        // Create table rows combining includes and excludes
        const maxRows = Math.max(
            packageData.includes?.length || 0,
            packageData.excludes?.length || 0
        )

        const includeExcludeRows = []
        for (let i = 0; i < maxRows; i++) {
            includeExcludeRows.push([
                packageData.includes?.[i] ? parseItineraryText(packageData.includes[i]) : '',
                packageData.excludes?.[i] ? parseItineraryText(packageData.excludes[i]) : ''
            ])
        }

        doc.autoTable({
            startY: yPos,
            head: [['Harga Sudah Termasuk', 'Harga Belum Termasuk']],
            body: includeExcludeRows,
            theme: 'grid',
            headStyles: {
                fontSize: 10,
                fontStyle: 'bold',
                halign: 'left'
            },
            columnStyles: {
                0: {
                    cellWidth: (pageWidth - margin * 2) / 2,
                    fillColor: [240, 253, 244],
                    textColor: [16, 185, 129]
                },
                1: {
                    cellWidth: (pageWidth - margin * 2) / 2,
                    fillColor: [254, 242, 242],
                    textColor: [239, 68, 68]
                }
            },
            bodyStyles: {
                fontSize: 9,
                textColor: [60, 60, 60]
            },
            margin: { left: margin, right: margin },
            styles: {
                lineColor: [200, 200, 200],
                lineWidth: 0.1
            }
        })

        yPos = doc.lastAutoTable.finalY + 10
    }

    // ====== Note Section ======
    checkPageOverflow(15)

    doc.setDrawColor(200, 200, 200)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 8

    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.setFont(undefined, 'italic')
    const noteText = '* Jadwal di atas tidak mengikat (flexible). Jika ada rancangan sendiri bisa dibincangkan dan disesuaikan dengan waktu dan keadaan.'
    const noteLines = doc.splitTextToSize(noteText, pageWidth - margin * 2)
    noteLines.forEach(line => {
        doc.text(line, margin, yPos)
        yPos += 4
    })

    // ====== Footer - Contact Info ======
    const footerY = pageHeight - 25

    doc.setFillColor(245, 245, 245)
    doc.rect(0, footerY - 10, pageWidth, 40, 'F')

    doc.setDrawColor(16, 185, 129)
    doc.setLineWidth(0.5)
    doc.line(0, footerY - 10, pageWidth, footerY - 10)

    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.setFont(undefined, 'bold')
    doc.text('Hubungi Kami:', margin, footerY)

    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(16, 185, 129)
    doc.text('WhatsApp: +62 822 2722 7039', margin, footerY + 6)

    doc.setTextColor(80, 80, 80)
    doc.text('Website: wahyubandungtour.com', margin, footerY + 12)

    // Save PDF
    const filename = `${packageData.slug || packageData.title.toLowerCase().replace(/\s+/g, '-')}-itinerary.pdf`
    doc.save(filename)
}
