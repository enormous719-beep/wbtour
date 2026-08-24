import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export function generateItineraryPDF(packageData) {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let yPos = 20

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

    doc.setFontSize(26)
    doc.setTextColor(255, 255, 255)
    doc.setFont(undefined, 'bold')
    doc.text('WBTour', margin, 18)

    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text('Wahyu Bandung Tour - Your Travel Partner', margin, 26)

    yPos = 50

    // ====== Package Title with border ======
    doc.setDrawColor(16, 185, 129)
    doc.setLineWidth(0.5)
    doc.line(margin, yPos - 5, pageWidth - margin, yPos - 5)

    doc.setFontSize(20)
    doc.setTextColor(16, 185, 129)
    doc.setFont(undefined, 'bold')
    const titleLines = doc.splitTextToSize(packageData.title, pageWidth - margin * 2)
    titleLines.forEach(line => {
        doc.text(line, margin, yPos)
        yPos += 7
    })
    yPos += 3

    // Duration & City with icons
    doc.setFontSize(11)
    doc.setTextColor(80, 80, 80)
    doc.setFont(undefined, 'normal')
    doc.text(`Destinasi: ${packageData.city} | Durasi: ${packageData.days} Hari ${packageData.nights} Malam`, margin, yPos)

    doc.setDrawColor(16, 185, 129)
    doc.line(margin, yPos + 3, pageWidth - margin, yPos + 3)
    yPos += 15

    // ====== Highlights Section ======
    if (packageData.highlights && packageData.highlights.length > 0) {
        checkPageOverflow(20)

        doc.setFontSize(14)
        doc.setTextColor(0, 0, 0)
        doc.setFont(undefined, 'bold')
        doc.text('✨ Highlights', margin, yPos)
        yPos += 8

        doc.setFontSize(10)
        doc.setTextColor(60, 60, 60)
        doc.setFont(undefined, 'normal')

        packageData.highlights.forEach((highlight) => {
            checkPageOverflow(7)
            const bullet = `  •  ${highlight}`
            const lines = doc.splitTextToSize(bullet, pageWidth - margin * 2 - 5)
            lines.forEach(line => {
                doc.text(line, margin, yPos)
                yPos += 5
            })
        })
        yPos += 8
    }

    // ====== Itinerary Section ======
    if (packageData.itinerary && packageData.itinerary.length > 0) {
        checkPageOverflow(20)

        doc.setFontSize(14)
        doc.setTextColor(0, 0, 0)
        doc.setFont(undefined, 'bold')
        doc.text('📅 Itinerary Lengkap', margin, yPos)
        yPos += 10

        packageData.itinerary.forEach((dayActivities, dayIndex) => {
            checkPageOverflow(15)

            // Day header with background
            doc.setFillColor(240, 253, 244) // Light green
            doc.roundedRect(margin - 2, yPos - 6, pageWidth - margin * 2 + 4, 10, 2, 2, 'F')

            doc.setFontSize(12)
            doc.setFont(undefined, 'bold')
            doc.setTextColor(16, 185, 129)
            doc.text(`Hari ${dayIndex + 1}`, margin + 2, yPos)
            yPos += 10

            // Activities
            doc.setFont(undefined, 'normal')
            doc.setFontSize(10)
            doc.setTextColor(60, 60, 60)

            if (Array.isArray(dayActivities)) {
                dayActivities.forEach(activity => {
                    checkPageOverflow(7)
                    const activityText = `  •  ${activity}`
                    const lines = doc.splitTextToSize(activityText, pageWidth - margin * 2 - 5)
                    lines.forEach(line => {
                        doc.text(line, margin + 3, yPos)
                        yPos += 5
                    })
                })
            }
            yPos += 6
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

        const halfWidth = (pageWidth - margin * 3) / 2
        let leftY = yPos
        let rightY = yPos

        // Include (left column)
        if (packageData.includes && packageData.includes.length > 0) {
            doc.setFontSize(12)
            doc.setTextColor(16, 185, 129)
            doc.setFont(undefined, 'bold')
            doc.text('✓ Termasuk', margin, leftY)
            leftY += 7

            doc.setFontSize(9)
            doc.setTextColor(60, 60, 60)
            doc.setFont(undefined, 'normal')

            packageData.includes.forEach(item => {
                const lines = doc.splitTextToSize(`✓ ${item}`, halfWidth - 5)
                lines.forEach(line => {
                    if (leftY > pageHeight - 40) return
                    doc.text(line, margin + 2, leftY)
                    leftY += 4.5
                })
            })
        }

        // Exclude (right column)
        if (packageData.excludes && packageData.excludes.length > 0) {
            doc.setFontSize(12)
            doc.setTextColor(239, 68, 68)
            doc.setFont(undefined, 'bold')
            doc.text('✗ Tidak Termasuk', margin + halfWidth + 10, rightY)
            rightY += 7

            doc.setFontSize(9)
            doc.setTextColor(60, 60, 60)
            doc.setFont(undefined, 'normal')

            packageData.excludes.forEach(item => {
                const lines = doc.splitTextToSize(`✗ ${item}`, halfWidth - 5)
                lines.forEach(line => {
                    if (rightY > pageHeight - 40) return
                    doc.text(line, margin + halfWidth + 12, rightY)
                    rightY += 4.5
                })
            })
        }

        yPos = Math.max(leftY, rightY) + 10
    }

    // ====== Price Section ======
    checkPageOverflow(25)

    doc.setDrawColor(200, 200, 200)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 10

    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.setFont(undefined, 'bold')
    doc.text('💰 Harga Paket', margin, yPos)
    yPos += 8

    if (packageData.priceOptions && packageData.priceOptions.length > 0) {
        doc.setFontSize(10)
        doc.setFont(undefined, 'normal')
        packageData.priceOptions.forEach(option => {
            checkPageOverflow(6)
            doc.setTextColor(60, 60, 60)
            doc.text(`${option.name}:`, margin + 3, yPos)
            doc.setTextColor(16, 185, 129)
            doc.setFont(undefined, 'bold')
            doc.text(`Rp ${option.price.toLocaleString('id-ID')}`, margin + 80, yPos)
            doc.setFont(undefined, 'normal')
            yPos += 6
        })
    } else {
        doc.setFontSize(18)
        doc.setTextColor(16, 185, 129)
        doc.setFont(undefined, 'bold')
        doc.text(`Rp ${packageData.price.toLocaleString('id-ID')}`, margin + 3, yPos)
        yPos += 8
    }

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
    doc.text('📱 WhatsApp: +62 822 2722 7039', margin, footerY + 6)

    doc.setTextColor(80, 80, 80)
    doc.text('🌐 Website: wahyubandungtour.com', margin, footerY + 12)

    // Save PDF
    const filename = `${packageData.slug || packageData.title.toLowerCase().replace(/\s+/g, '-')}-itinerary.pdf`
    doc.save(filename)
}
