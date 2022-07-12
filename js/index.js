document.addEventListener('DOMContentLoaded', updateList)



$(document).on("change", "input[name='rowCheckbox']", function () {
    let checkStatus, extensionId
    checkStatus = $(this).is(":checked")
    extensionId = $(this).data('id')
    chrome.management.setEnabled(`${extensionId}`, checkStatus)
    updateList()
})


$(document).on("click", "button", function () {
    let button_id = $(this).attr('id')
    if (button_id === "disable-btn") {
        selection('disable')
    } else (selection('enable'))

})

const contactsEL = document.getElementById('contacts')
const listofExtensions = document.getElementById('list-of-extensions')
let year = new Date().getFullYear()

contactsEL.innerHTML = `<a href="" target="_blank"><p>©RavelTech ${year}</p></a>`


function updateList() {
    let extList
    extList = []
    chrome.management.getAll(function (items) {
        for (i = 0; i < items.length; i++) {
            let ext = items[i]
            extList.push(ext)
        }
        render(extList)
    })

}

function selection(filter) {
    let allChecked, mode, i, thisExtension
    allChecked = document.getElementsByName("rowCheckbox")
    thisExtension = document.getElementsByTagName("h1")[0].innerText

    if (filter === 'enable') {
        mode = true
        selectAll(mode)
    } else if (filter === 'disable') {
        mode = false
        selectAll(mode)
    }
    updateList()

    function selectAll(modeStatus) {
        for (i = 0; i < allChecked.length; i++) {
            let extensionId,extension,extensionName
            extension = allChecked[i]
            extensionId = extension.dataset['id']
            extensionName = extension.dataset['extensionName']
            console.log(extension)
            if(extensionName.toLowerCase()!==thisExtension.toLowerCase()){
                extension.checked = modeStatus
                chrome.management.setEnabled(`${extensionId}`, modeStatus)
            }
        }
    }
}



function render(renderList) {
    let leadList
    leadList = `<tr><th class="img-col" data-column = "icon"></th><th id="names-header" data-column = "name" style="width:85%" ></th><th data-column = "checkbox"></th></tr>`
    renderList.sort((a, b) => a.name.localeCompare(b.name))
    renderList.forEach(function (extension) {
        let extName, extId, extVersion, iconDetails, iconUrl, installation, iconIcons, isEnabled, checkStatus, checkName
        extName = extension.name
        extId = extension.id
        extVersion = extension.version
        iconIcons = extension.icons
        iconDetails = getUrl(iconIcons)
        iconUrl = iconDetails[0]
        installation = iconDetails[1]
        isEnabled = extension.enabled
        checkStatus = ""
        checkName = "Enable"
        if (isEnabled) {
            checkStatus = "checked"
            checkName = "Disable"
        }
        leadList += `
        <tr data-row-id = "${extName}" title = "Installation type: ${installation}" data-installation="${installation}" data-extension-enabled="${isEnabled}">
        <td> <div> <img class='ext-img' src="${iconUrl}" alt="logo"></div></td>
        <td class="extension-name"><label> ${extName}</label>
        <span class="grey" >${extVersion}</span></td>
        <td class="checkbox" ><input data-id="${extId}" data-extension-name="${extName}" type="checkbox" name="rowCheckbox" title = "${checkName}" ${checkStatus}></td>
        </tr>
        `
    })
    listofExtensions.innerHTML = leadList

    function getUrl(ext) {
        let urlLink, extensionInstallation, iconDetails, missing_logo
        missing_logo = "images/logo_blank.png"
        try {
            urlLink = ext[3].url
        } catch (error) {
            try {
                urlLink = ext[2].url
            } catch (error) {
                try {
                    urlLink = ext[1].url
                } catch (error) {
                    try {
                        urlLink = ext[0].url
                    } catch (error) {
                        urlLink = missing_logo
                    }
                }

            }

        }
        if (urlLink !== missing_logo) {
            extensionInstallation = "Regular"
        } else {
            extensionInstallation = "Development"
        }

        iconDetails = [urlLink, extensionInstallation]
        return iconDetails
    }

}